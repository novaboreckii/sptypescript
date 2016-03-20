module CSR {
    export class LookupFieldFilteredTemplate{
        fieldName: string;
        camlFilter: string;
        listname: string;
        lookupField: string
        constructor(fieldName: string, camlFilter: string, listname?: string, lookupField?: string) {
            this.fieldName = fieldName;
            this.camlFilter = camlFilter;
            this.listname = listname || null;
            this.lookupField = lookupField || null;
        }

        renderField(rCtx: SPClientTemplates.RenderContext_FieldInForm) {
            var parseRegex = /\{[^\}]+\}/g;
            var dependencyExpressions: string[] = [];
            var result: RegExpExecArray;
            while ((result = parseRegex.exec(this.camlFilter))) {
                dependencyExpressions.push(stripBraces(result[0]));
            }
            var dependencyValues: { [expr: string]: string } = {};

            var _dropdownElt: HTMLSelectElement;
            var _myData: SPClientTemplates.ClientFormContext;


            if (rCtx == null)
                return '';
            _myData = SPClientTemplates.Utility.GetFormContextForCurrentField(rCtx);

            if (_myData == null || _myData.fieldSchema == null)
                return '';


            var _schema = <SPClientTemplates.FieldSchema_InForm_Lookup>_myData.fieldSchema;

            var validators = new SPClientForms.ClientValidation.ValidatorSet();
            validators.RegisterValidator(new BooleanValueValidator(() => _optionsLoaded, "Wait until lookup values loaded and try again"));

            if (_myData.fieldSchema.Required) {
                validators.RegisterValidator(new SPClientForms.ClientValidation.RequiredValidator());
            }
            _myData.registerClientValidator(_myData.fieldName, validators);

            var _dropdownId = _myData.fieldName + '_' + _myData.fieldSchema.Id + '_$LookupField';
            var _valueStr = _myData.fieldValue != null ? _myData.fieldValue : '';
            var _selectedValue = SPClientTemplates.Utility.ParseLookupValue(_valueStr).LookupId;
            var _noValueSelected = _selectedValue == 0;
            var _optionsLoaded = false;
            var pendingLoads = 0;

            if (_noValueSelected)
                _valueStr = '';

            _myData.registerInitCallback(_myData.fieldName, InitLookupControl);

            _myData.registerFocusCallback(_myData.fieldName, function () {
                if (_dropdownElt != null)
                    _dropdownElt.focus();
            });
            _myData.registerValidationErrorCallback(_myData.fieldName, function (errorResult) {
                SPFormControl_AppendValidationErrorMessage(_dropdownId, errorResult);
            });
            _myData.registerGetValueCallback(_myData.fieldName, GetCurrentLookupValue);
            _myData.updateControlValue(_myData.fieldName, _valueStr);

            return BuildLookupDropdownControl();

            function InitLookupControl() {
                _dropdownElt = <HTMLSelectElement>document.getElementById(_dropdownId);
                if (_dropdownElt != null)
                    AddEvtHandler(_dropdownElt, "onchange", OnLookupValueChanged);

                SP.SOD.executeFunc('sp.js', 'SP.ClientContext', () => {
                    bindDependentControls(dependencyExpressions);
                    loadOptions(true);
                });
            }


            function BuildLookupDropdownControl() {
                var result = '<span dir="' + STSHtmlEncode(_myData.fieldSchema.Direction) + '">';
                result += '<select id="' + STSHtmlEncode(_dropdownId) + '" title="' + STSHtmlEncode(_myData.fieldSchema.Title) + '">';
                result += '</select><br/></span>';
                return result;
            }


            function OnLookupValueChanged() {
                if (_optionsLoaded) {
                    if (_dropdownElt != null) {
                        _myData.updateControlValue(_myData.fieldName, GetCurrentLookupValue());
                        _selectedValue = parseInt(_dropdownElt.value, 10);
                    }
                }
            }

            function GetCurrentLookupValue() {
                if (_dropdownElt == null)
                    return '';
                return _dropdownElt.value == '0' || _dropdownElt.value == '' ? '' : _dropdownElt.value + ';#' + _dropdownElt.options[_dropdownElt.selectedIndex]["text"];
            }

            function stripBraces(input: string): string {
                return input.substring(1, input.length - 1);
            }

            function getDependencyValue(expr: string, value: string, listId: string, expressionParts: string[], callback: () => void) {
                var isLookupValue = !!listId;
                if (isLookupValue) {
                    var lookup = SPClientTemplates.Utility.ParseLookupValue(value);
                    if (expressionParts.length == 1 && expressionParts[0] == 'Value') {
                        value = lookup.LookupValue;
                        expressionParts.shift();
                    } else {
                        value = lookup.LookupId.toString();
                    }
                }

                if (expressionParts.length == 0) {
                    dependencyValues[expr] = value;
                    callback();
                } else {
                    var ctx = SP.ClientContext.get_current();
                    var web = ctx.get_web();
                    //TODO: Handle lookup to another web
                    var list = web.get_lists().getById(listId);
                    var item = list.getItemById(parseInt(value, 10));
                    var field = list.get_fields().getByInternalNameOrTitle(expressionParts.shift());
                    ctx.load(item);
                    ctx.load(field);

                    ctx.executeQueryAsync((o, e) => {
                        var value = item.get_item(field.get_internalName());

                        if (field.get_typeAsString() == 'Lookup') {
                            field = <SP.Field>ctx.castTo(field, SP.FieldLookup);
                            var lookup = (<SP.FieldLookupValue>value);
                            value = lookup.get_lookupId() + ';#' + lookup.get_lookupValue();
                            listId = (<SP.FieldLookup>field).get_lookupList();
                        }

                        getDependencyValue(expr, value, listId, expressionParts, callback);

                    }, (o, args) => { console.log(args.get_message()); });
                }
            }

            function bindDependentControls(dependencyExpressions: string[]) {
                dependencyExpressions.forEach(expr => {
                    var exprParts = expr.split(".");
                    var field = exprParts.shift();

                    CSR.addUpdatedValueCallback(rCtx, field,
                        (v, s) => {
                            getDependencyValue(expr, v,
                                (<SPClientTemplates.FieldSchema_InForm_Lookup>s).LookupListId,
                                exprParts.slice(0),
                                loadOptions);
                        });

                });
            }


            function loadOptions(isFirstLoad?: boolean) {
                _optionsLoaded = false;
                pendingLoads++;

                var ctx = SP.ClientContext.get_current();
                //TODO: Handle lookup to another web
                var web = ctx.get_web();
                var listId = _schema.LookupListId;
                var list = !this.listname ? web.get_lists().getById(listId) : web.get_lists().getByTitle(this.listname);
                var query = new SP.CamlQuery();

                var predicate = this.camlFilter.replace(parseRegex, (v, a) => {
                    var expr = stripBraces(v);
                    return dependencyValues[expr] ? dependencyValues[expr] : '';
                });

                //TODO: Handle ShowField attribure
                if (predicate.substr(0, 5) == '<View') {
                    query.set_viewXml(predicate);
                } else {
                    query.set_viewXml('<View Scope="RecursiveAll"><Query><Where>' +
                        predicate +
                        '</Where></Query> ' +
                        '<ViewFields><FieldRef Name="ID" /><FieldRef Name="Title"/></ViewFields></View>');
                }
                var results = list.getItems(query);
                ctx.load(results);


                ctx.executeQueryAsync((o, e) => {
                    var selected = false;

                    while (_dropdownElt.options.length) {
                        (<any>_dropdownElt.options).remove(0);
                    }

                    if (!_schema.Required) {
                        var defaultOpt = new Option(Strings.STS.L_LookupFieldNoneOption, '0', selected, selected);
                        (<any>_dropdownElt.options).add(defaultOpt);
                        selected = _selectedValue == 0;
                    }
                    var isEmptyList = true;

                    var enumerator = results.getEnumerator();
                    while (enumerator.moveNext()) {
                        var c = enumerator.get_current();
                        var id: number;
                        var text: string;

                        if (!this.lookupField) {
                            id = c.get_id();
                            text = c.get_item('Title');
                        } else {
                            var value = <SP.FieldLookupValue>c.get_item(this.lookupField);
                            id = value.get_lookupId();
                            text = value.get_lookupValue();
                        }
                        var isSelected = _selectedValue == id;
                        if (isSelected) {
                            selected = true;
                        }
                        var opt = new Option(text, id.toString(), isSelected, isSelected);
                        (<any>_dropdownElt.options).add(opt);
                        isEmptyList = false;
                    }
                    pendingLoads--;
                    _optionsLoaded = true;
                    if (!pendingLoads) {
                        if (isFirstLoad) {
                            if (_selectedValue == 0 && !selected) {
                                _dropdownElt.selectedIndex = 0;
                                OnLookupValueChanged();
                            }
                        } else {
                            if (_selectedValue != 0 && !selected) {
                                _dropdownElt.selectedIndex = 0;
                            }
                            OnLookupValueChanged();
                        }
                    }


                }, (o, args) => { console.log(args.get_message()); });
            }
        }

    }

}