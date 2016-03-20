module CSR {
    export function makeFieldHidden(fieldName: string, schema: SPClientTemplates.FieldSchema, ctx: SPClientTemplates.RenderContext) {
        if (ctx.ControlMode == SPClientTemplates.ClientControlMode.Invalid) return;
        (<SPClientTemplates.FieldSchema_InForm>schema).Hidden = true;

        if (ctx.ControlMode == SPClientTemplates.ClientControlMode.View) {
            var ctxInView = <SPClientTemplates.RenderContext_InView>ctx;

            if (ctxInView.inGridMode) {
                //TODO: Hide item in grid mode
            } else {
                ctxInView.ListSchema.Field.splice(ctxInView.ListSchema.Field.indexOf(schema), 1);
            }

        } else {
            var ctxInForm = <SPClientTemplates.RenderContext_Form>ctx;

            var pHolderId = ctxInForm.FormUniqueId + ctxInForm.FormContext.listAttributes.Id + fieldName;
            var placeholder = $get(pHolderId);
            var current = placeholder;
            while (current.tagName.toUpperCase() !== "TR") {
                current = current.parentElement;
            }
            var row = <HTMLTableRowElement>current;
            row.style.display = 'none';

        }
    }
}