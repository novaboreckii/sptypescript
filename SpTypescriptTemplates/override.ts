module CSR {
    /** Creates new overrides. Call .register() at the end.*/
    export function override(listTemplateType?: number, baseViewId?: number | string): ICSR {
        return new csr(listTemplateType, baseViewId)
            .onPreRender(hookFormContext)
            .onPostRender(fixCsrCustomLayout);

        function hookFormContext(ctx: IFormRenderContexWithHook) {
            if (ctx.ControlMode == SPClientTemplates.ClientControlMode.EditForm
                || ctx.ControlMode == SPClientTemplates.ClientControlMode.NewForm) {

                for (var i = 0; i < ctx.ListSchema.Field.length; i++) {
                    var fieldSchemaInForm = ctx.ListSchema.Field[i];

                    if (!ctx.FormContextHook) {
                        ctx.FormContextHook = {}

                        var oldRegisterGetValueCallback = ctx.FormContext.registerGetValueCallback;
                        ctx.FormContext.registerGetValueCallback = (fieldName, callback) => {
                            ctx.FormContextHook[fieldName].getValue = callback;
                            oldRegisterGetValueCallback(fieldName, callback);
                        };

                        var oldUpdateControlValue = ctx.FormContext.updateControlValue;
                        ctx.FormContext.updateControlValue = (fieldName: string, value: any) => {
                            oldUpdateControlValue(fieldName, value);

                            var hookedContext = ensureFormContextHookField(ctx.FormContextHook, fieldName);
                            hookedContext.lastValue = value;

                            var updatedCallbacks = ctx.FormContextHook[fieldName].updatedValueCallbacks;
                            for (var i = 0; i < updatedCallbacks.length; i++) {
                                updatedCallbacks[i](value, hookedContext.fieldSchema);
                            }

                        }
                    }
                    ensureFormContextHookField(ctx.FormContextHook, fieldSchemaInForm.Name).fieldSchema = fieldSchemaInForm;
                }
            }
        }

        function fixCsrCustomLayout(ctx: SPClientTemplates.RenderContext_Form) {
            if (ctx.ControlMode == SPClientTemplates.ClientControlMode.Invalid
                || ctx.ControlMode == SPClientTemplates.ClientControlMode.View) {
                return;
            }

            if (ctx.ListSchema.Field.length > 1) {
                var wpq = ctx.FormUniqueId;
                var webpart = $get('WebPart' + wpq);
                var forms = webpart.getElementsByClassName('ms-formtable');

                if (forms.length > 0) {
                    var placeholder = $get(wpq + 'ClientFormTopContainer');
                    var fragment = document.createDocumentFragment();
                    for (var i = 0; i < placeholder.children.length; i++) {
                        fragment.appendChild(placeholder.children.item(i));
                    }

                    var form = forms.item(0);
                    form.parentNode.replaceChild(fragment, form);
                }

                var old = ctx.CurrentItem;
                ctx.CurrentItem = ctx.ListData.Items[0];
                var fields = ctx.ListSchema.Field;
                for (var j = 0; j < fields.length; j++) {
                    var field = fields[j];
                    var pHolderId = wpq + ctx.FormContext.listAttributes.Id + field.Name;
                    var span = $get(pHolderId);
                    if (span) {
                        span.outerHTML = ctx.RenderFieldByName(ctx, field.Name);
                    }
                }
                ctx.CurrentItem = old;
            }

        }


    }
}