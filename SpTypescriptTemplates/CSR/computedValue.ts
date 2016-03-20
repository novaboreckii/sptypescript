module CSR {
    export function computedValue(targetField: string, dependentValues: { [field: string]: string }, transform: (...values: string[]) => string, schema, ctx: SPClientTemplates.RenderContext_FieldInForm, ...sourceField: string[]) {
        if (ctx.ControlMode == SPClientTemplates.ClientControlMode.EditForm
            || ctx.ControlMode == SPClientTemplates.ClientControlMode.NewForm) {
            var targetControl = CSR.getControl(schema);
            sourceField.forEach((field) => {
                CSR.addUpdatedValueCallback(ctx, field, v => {
                    dependentValues[field] = v;
                    targetControl.value = transform.apply(this,
                        sourceField.map(n => dependentValues[n] || ''));

                });
            });
        }
    }
}