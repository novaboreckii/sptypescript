module CSR {
    export class koEditFieldTemplate {
        fieldName: string;
        template: string;
        vm: IKoFieldInForm;
        dependencyFields: string[]
        constructor(fieldName: string, template: string, vm: IKoFieldInForm, dependencyFields?: string[]) {
            this.fieldName = fieldName;
            this.template = template;
            this.vm = vm;
            this.dependencyFields = dependencyFields || null;

        }

        renderField(rCtx: SPClientTemplates.RenderContext_FieldInForm) {
            if (rCtx == null)
                return '';
            var _myData = SPClientTemplates.Utility.GetFormContextForCurrentField(rCtx);

            if (_myData == null || _myData.fieldSchema == null)
                return '';
            var elementId = _myData.fieldName + '_' + _myData.fieldSchema.Id + '_$' + _myData.fieldSchema.Type;

            this.vm.renderingContext = rCtx;


            if (this.dependencyFields) {
                this.dependencyFields.forEach(dependencyField => {
                    if (!this.vm[dependencyField]) {
                        this.vm[dependencyField] = ko.observable(CSR.getFieldValue(rCtx, dependencyField));
                    }
                    CSR.addUpdatedValueCallback(rCtx, dependencyField, v => {
                        this.vm[dependencyField](v);
                    });
                });
            }


            if (!this.vm.value) {
                this.vm.value = ko.observable<any>();
            }

            this.vm.value.subscribe(v => { _myData.updateControlValue(this.fieldName, v); });
            _myData.registerGetValueCallback(this.fieldName, () => this.vm.value());


            _myData.registerInitCallback(this.fieldName, () => {
                ko.applyBindings(this.vm, $get(elementId));
            });

            return '<div id="' + STSHtmlEncode(elementId) + '">' + this.template + '</div>';
        }
    }
}