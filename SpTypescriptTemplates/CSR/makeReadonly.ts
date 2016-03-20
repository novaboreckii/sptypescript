module CSR {
    export function makeFieldReadonly(fieldName: string, schema: SPClientTemplates.FieldSchema, ctx: SPClientTemplates.RenderContext) {
        if (ctx.ControlMode == SPClientTemplates.ClientControlMode.Invalid
            || ctx.ControlMode == SPClientTemplates.ClientControlMode.DisplayForm) return;
        (<SPClientTemplates.FieldSchema_InForm>schema).ReadOnlyField = true;
        (<SPClientTemplates.FieldSchema_InView>schema).ReadOnly = "TRUE";

        if (ctx.ControlMode == SPClientTemplates.ClientControlMode.View) {
            var ctxInView = <SPClientTemplates.RenderContext_InView>ctx;
            if (ctxInView.inGridMode) {
                //TODO: Disable editing in grid mode

            }

        } else {
            var ctxInForm = <SPClientTemplates.RenderContext_FieldInForm>ctx;
            if (schema.Type != 'User' && schema.Type != 'UserMulti') {

                var template = getFieldTemplate(schema, SPClientTemplates.ClientControlMode.DisplayForm);
                ctxInForm.Templates.Fields[fieldName] = template;
                ctxInForm.FormContext.registerGetValueCallback(fieldName, () => ctxInForm.ListData.Items[0][fieldName]);

            }
        }
    }
    export function makePeoplePickerReadOnly(fieldName: string, schema: SPClientTemplates.FieldSchema_InForm_User, ctx: SPClientTemplates.RenderContext) {
        if (ctx.ControlMode == SPClientTemplates.ClientControlMode.EditForm
            || ctx.ControlMode == SPClientTemplates.ClientControlMode.NewForm) {
            if (schema.Type == 'User' || schema.Type == 'UserMulti') {
                SP.SOD.executeFunc('clientpeoplepicker.js', 'SPClientPeoplePicker', () => {
                    var topSpanId = schema.Name + '_' + schema.Id + '_$ClientPeoplePicker';
                    var retryCount = 10;
                    var callback = () => {
                        var pp = SPClientPeoplePicker.SPClientPeoplePickerDict[topSpanId];
                        if (!pp) {
                            if (retryCount--) setTimeout(callback, 1);
                        } else {
                            pp.SetEnabledState(false);
                            pp.DeleteProcessedUser = function () { };
                        }
                    };
                    callback();
                });
            }
        }
    }
}