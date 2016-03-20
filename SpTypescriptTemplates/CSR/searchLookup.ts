module CSR {
    export function searchLookup(fieldName: string,ctx: IAutoFillFieldContext) {
        var _myData = ctx.fieldContext;
        var _schema = <SPClientTemplates.FieldSchema_InForm_Lookup>_myData.fieldSchema;
        if (_myData.fieldSchema.Type != 'Lookup') {
            return null;
        }

        var _valueStr = _myData.fieldValue != null ? _myData.fieldValue : '';
        var _selectedValue = SPClientTemplates.Utility.ParseLookupValue(_valueStr);
        var _noValueSelected = _selectedValue.LookupId == 0;
        ctx.control.value = _selectedValue.LookupValue;
        $addHandler(ctx.control, "blur", _ => {
            if (ctx.control.value == '') {
                _myData.fieldValue = '';
                _myData.updateControlValue(fieldName, _myData.fieldValue);
            }
        });

        if (_noValueSelected)
            _myData.fieldValue = '';

        var _autoFillControl = ctx.autofill;
        _autoFillControl.AutoFillMinTextLength = 2;
        _autoFillControl.VisibleItemCount = 15;
        _autoFillControl.AutoFillTimeout = 500;

        return () => {
            var value = ctx.control.value;
            _autoFillControl.PopulateAutoFill([AutoFillOptionBuilder.buildLoadingItem('Please wait...')], onSelectItem);

            SP.SOD.executeFunc("sp.search.js", "Microsoft.SharePoint.Client.Search.Query", () => {
                var Search = Microsoft.SharePoint.Client.Search.Query;
                var ctx = SP.ClientContext.get_current();
                var query = new Search.KeywordQuery(ctx);
                query.set_rowLimit(_autoFillControl.VisibleItemCount);
                query.set_queryText('contentclass:STS_ListItem ListID:{' + _schema.LookupListId + '} ' + value);
                var selectProps = query.get_selectProperties();
                selectProps.clear();
                //TODO: Handle ShowField attribute
                selectProps.add('Title');
                selectProps.add('ListItemId');
                var executor = new Search.SearchExecutor(ctx);
                var result = executor.executeQuery(query);
                ctx.executeQueryAsync(
                    () => {
                        //TODO: Discover proper way to load collection
                        var tableCollection = new Search.ResultTableCollection();
                        tableCollection.initPropertiesFromJson(result.get_value());

                        var relevantResults = tableCollection.get_item(0);
                        var rows = relevantResults.get_resultRows();

                        var items = [];
                        for (var i = 0; i < rows.length; i++) {
                            items.push(AutoFillOptionBuilder.buildOptionItem(parseInt(rows[i]["ListItemId"], 10), rows[i]["Title"]));
                        }

                        items.push(AutoFillOptionBuilder.buildSeparatorItem());

                        if (relevantResults.get_totalRows() == 0)
                            items.push(AutoFillOptionBuilder.buildFooterItem("No results. Please refine your query."));
                        else
                            items.push(AutoFillOptionBuilder.buildFooterItem("Showing " + rows.length + " of" + relevantResults.get_totalRows() + " items!"));

                        _autoFillControl.PopulateAutoFill(items, onSelectItem);

                    },
                    (sender, args) => {
                        _autoFillControl.PopulateAutoFill([AutoFillOptionBuilder.buildFooterItem("Error executing query/ See log for details.")], onSelectItem);
                        console.log(args.get_message());
                    });
            });
        }

        function onSelectItem(targetInputId, item: ISPClientAutoFillData) {
            var targetElement = ctx.control;
            targetElement.value = item[SPClientAutoFill.DisplayTextProperty];
            _selectedValue.LookupId = item[SPClientAutoFill.KeyProperty];
            _selectedValue.LookupValue = item[SPClientAutoFill.DisplayTextProperty];
            _myData.fieldValue = item[SPClientAutoFill.KeyProperty] + ';#' + item[SPClientAutoFill.TitleTextProperty];
            _myData.updateControlValue(_myData.fieldSchema.Name, _myData.fieldValue);
        }
    }
}