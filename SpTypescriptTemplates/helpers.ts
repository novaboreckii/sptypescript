module CSR {
    export function getFieldValue(ctx: SPClientTemplates.RenderContext_Form, fieldName: string): any {
        if (ctx.ControlMode == SPClientTemplates.ClientControlMode.EditForm
            || ctx.ControlMode == SPClientTemplates.ClientControlMode.NewForm) {
            var contextWithHook = <IFormRenderContexWithHook>ctx;
            if (contextWithHook.FormContextHook
                && contextWithHook.FormContextHook[fieldName]
                && contextWithHook.FormContextHook[fieldName].getValue) {
                return contextWithHook.FormContextHook[fieldName].getValue();
            }
        }
        return null;
    }

    export function getFieldSchema(ctx: SPClientTemplates.RenderContext_Form, fieldName: string): SPClientTemplates.FieldSchema_InForm {
        if (ctx.ControlMode == SPClientTemplates.ClientControlMode.EditForm
            || ctx.ControlMode == SPClientTemplates.ClientControlMode.NewForm) {
            var contextWithHook = <IFormRenderContexWithHook>ctx;
            if (contextWithHook.FormContextHook
                && contextWithHook.FormContextHook[fieldName]) {
                return contextWithHook.FormContextHook[fieldName].fieldSchema;
            }
        }
        return null;
    }

    export function addUpdatedValueCallback(ctx: SPClientTemplates.RenderContext_Form, fieldName: string, callback: UpdatedValueCallback): void {
        if (ctx.ControlMode == SPClientTemplates.ClientControlMode.EditForm
            || ctx.ControlMode == SPClientTemplates.ClientControlMode.NewForm) {
            var contextWithHook = <IFormRenderContexWithHook>ctx;
            if (contextWithHook.FormContextHook) {
                var f = ensureFormContextHookField(contextWithHook.FormContextHook, fieldName);
                var callbacks = f.updatedValueCallbacks;
                if (callbacks.indexOf(callback) == -1) {
                    callbacks.push(callback);
                    if (f.lastValue) {
                        callback(f.lastValue, f.fieldSchema);
                    }
                }
            }
        }

    }

    export function removeUpdatedValueCallback(ctx: SPClientTemplates.RenderContext_Form, fieldName: string, callback: UpdatedValueCallback): void {
        if (ctx.ControlMode == SPClientTemplates.ClientControlMode.EditForm
            || ctx.ControlMode == SPClientTemplates.ClientControlMode.NewForm) {
            var contextWithHook = <IFormRenderContexWithHook>ctx;
            if (contextWithHook.FormContextHook) {
                var callbacks = ensureFormContextHookField(contextWithHook.FormContextHook, fieldName).updatedValueCallbacks;
                var index = callbacks.indexOf(callback);
                if (index != -1) {
                    callbacks.splice(index, 1);
                }
            }
        }
    }

    export function getControl(schema: SPClientTemplates.FieldSchema_InForm): HTMLInputElement {
        var id = schema.Name + '_' + schema.Id + '_$' + schema.FieldType + 'Field';
        //TODO: Handle different input types
        return <HTMLInputElement>$get(id);
    }

    export function getFieldTemplate(field: SPClientTemplates.FieldSchema, mode: SPClientTemplates.ClientControlMode): SPClientTemplates.FieldCallback {
        var ctx = { ListSchema: { Field: [field] }, FieldControlModes: {} };
        ctx.FieldControlModes[field.Name] = mode;
        var templates = SPClientTemplates.TemplateManager.GetTemplates(ctx);
        return templates.Fields[field.Name];
    }

}