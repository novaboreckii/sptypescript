module CSR {

    export class AutoFillLookupField{
        fieldName: string;
        init: (ctx: IAutoFillFieldContext) => void; 
        constructor(fieldName: string, init: (ctx: IAutoFillFieldContext) => void) {
            this.fieldName = fieldName;
            this.init = init;
        }

        renderField(rCtx: SPClientTemplates.RenderContext_FieldInForm) {
            if (rCtx == null)
                return '';
            var _myData = SPClientTemplates.Utility.GetFormContextForCurrentField(rCtx);

            if (_myData == null || _myData.fieldSchema == null)
                return '';

            var _autoFillControl: SPClientAutoFill;
            var _textInputElt: HTMLInputElement;
            var _textInputId = _myData.fieldName + '_' + _myData.fieldSchema.Id + '_$' + _myData.fieldSchema.Type + 'Field';
            var _autofillContainerId = _myData.fieldName + '_' + _myData.fieldSchema.Id + '_$AutoFill';

            var validators = new SPClientForms.ClientValidation.ValidatorSet();
            if (_myData.fieldSchema.Required) {
                validators.RegisterValidator(new SPClientForms.ClientValidation.RequiredValidator());
            }
            _myData.registerClientValidator(_myData.fieldName, validators);

            _myData.registerInitCallback(_myData.fieldName, initAutoFillControl);
            _myData.registerFocusCallback(_myData.fieldName, function () {
                if (_textInputElt != null)
                    _textInputElt.focus();
            });
            _myData.registerValidationErrorCallback(_myData.fieldName, function (errorResult) {
                SPFormControl_AppendValidationErrorMessage(_textInputId, errorResult);
            });
            _myData.registerGetValueCallback(_myData.fieldName, () => _myData.fieldValue);
            _myData.updateControlValue(_myData.fieldName, _myData.fieldValue);

            return buildAutoFillControl();

            function initAutoFillControl() {
                _textInputElt = <HTMLInputElement>document.getElementById(_textInputId);

                SP.SOD.executeFunc("autofill.js", "SPClientAutoFill", () => {
                    _autoFillControl = new SPClientAutoFill(_textInputId, _autofillContainerId, (_) => callback());
                    var callback = this.init({
                        renderContext: rCtx,
                        fieldContext: _myData,
                        autofill: _autoFillControl,
                        control: _textInputElt,
                    });

                    //_autoFillControl.AutoFillMinTextLength = 2;
                    //_autoFillControl.VisibleItemCount = 15;
                    //_autoFillControl.AutoFillTimeout = 500;
                });

            }
            //function OnPopulate(targetElement: HTMLInputElement) {

            //}

            //function OnLookupValueChanged() {
            //    _myData.updateControlValue(_myData.fieldName, GetCurrentLookupValue());
            //}
            //function GetCurrentLookupValue() {
            //    return _valueStr;
            //}
            function buildAutoFillControl() {
                var result: string[] = [];
                result.push('<div dir="' + STSHtmlEncode(_myData.fieldSchema.Direction) + '" style="position: relative;">');
                result.push('<input type="text" id="' + STSHtmlEncode(_textInputId) + '" title="' + STSHtmlEncode(_myData.fieldSchema.Title) + '"/>');

                result.push("<div class='sp-peoplepicker-autoFillContainer' id='" + STSHtmlEncode(_autofillContainerId) + "'></div>");
                result.push("</div>");

                return result.join("");
            }
        }

    }
}