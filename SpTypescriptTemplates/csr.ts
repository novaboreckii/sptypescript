/** Lightweight client-side rendering template overrides.*/
module CSR {

    export interface UpdatedValueCallback {
        (value: any, fieldSchema?: SPClientTemplates.FieldSchema_InForm): void;
    }

    export class csr implements ICSR, SPClientTemplates.TemplateOverridesOptions {

        public Templates: SPClientTemplates.TemplateOverrides;
        public OnPreRender: SPClientTemplates.RenderCallback[];
        public OnPostRender: SPClientTemplates.RenderCallback[];
        private IsRegistered: boolean;


        constructor(public ListTemplateType?: number, public BaseViewID?: any) {
            this.Templates = { Fields: {} };
            this.OnPreRender = [];
            this.OnPostRender = [];
            this.IsRegistered = false;
        }

        /* tier 1 methods */
        view(template: any): ICSR {
            this.Templates.View = template;
            return this;
        }

        item(template: any): ICSR {
            this.Templates.Item = template;
            return this;
        }

        header(template: any): ICSR {
            this.Templates.Header = template;
            return this;
        }

        body(template: any): ICSR {
            this.Templates.Body = template;
            return this;
        }

        footer(template: any): ICSR {
            this.Templates.Footer = template;
            return this;
        }

        fieldView(fieldName: string, template: any): ICSR {
            this.Templates.Fields[fieldName] = this.Templates.Fields[fieldName] || {};
            this.Templates.Fields[fieldName].View = template;
            return this;
        }

        fieldDisplay(fieldName: string, template: any): ICSR {
            this.Templates.Fields[fieldName] = this.Templates.Fields[fieldName] || {};
            this.Templates.Fields[fieldName].DisplayForm = template;
            return this;
        }

        fieldNew(fieldName: string, template: any): ICSR {
            this.Templates.Fields[fieldName] = this.Templates.Fields[fieldName] || {};
            this.Templates.Fields[fieldName].NewForm = template;
            return this;
        }

        fieldEdit(fieldName: string, template: any): ICSR {
            this.Templates.Fields[fieldName] = this.Templates.Fields[fieldName] || {};
            this.Templates.Fields[fieldName].EditForm = template;
            return this;
        }

        /* tier 2 methods */
        template(name: string, template: any): ICSR {
            this.Templates[name] = template;
            return this;
        }

        fieldTemplate(fieldName: string, name: string, template: any): ICSR {
            this.Templates.Fields[fieldName] = this.Templates.Fields[fieldName] || {};
            this.Templates.Fields[fieldName][name] = template;
            return this;
        }

        /* common */
        onPreRender(...callbacks: { (ctx: SPClientTemplates.RenderContext): void; }[]): ICSR {
            for (var i = 0; i < callbacks.length; i++) {
                this.OnPreRender.push(callbacks[i]);
            }
            return this;
        }

        onPostRender(...callbacks: { (ctx: SPClientTemplates.RenderContext): void; }[]): ICSR {
            for (var i = 0; i < callbacks.length; i++) {
                this.OnPostRender.push(callbacks[i]);
            }
            return this;
        }

        onPreRenderField(field: string, callback: { (schema: SPClientTemplates.FieldSchema, ctx: SPClientTemplates.RenderContext): void; }): ICSR {
            return this.onPreRender((ctx: SPClientTemplates.RenderContext) => {
                var ctxInView = <SPClientTemplates.RenderContext_InView>ctx;

                //ListSchema schma exists in Form and in View render context
                var fields = ctxInView.ListSchema.Field;
                if (fields) {
                    for (var i = 0; i < fields.length; i++) {
                        if (fields[i].Name === field) {
                            callback(fields[i], ctx);
                        }
                    }
                }
            });
        }

        onPostRenderField(field: string, callback: { (schema: SPClientTemplates.FieldSchema, ctx: SPClientTemplates.RenderContext): void; }): ICSR {
            return this.onPostRender((ctx: SPClientTemplates.RenderContext) => {
                var ctxInView = <SPClientTemplates.RenderContext_InView>ctx;

                //ListSchema schma exists in Form and in View render context
                var fields = ctxInView.ListSchema.Field;
                if (fields) {
                    for (var i = 0; i < fields.length; i++) {
                        if (fields[i].Name === field) {
                            callback(fields[i], ctx);
                        }
                    }
                }
            });
        }

        makeReadOnly(fieldName: string): ICSR {
            return this
                .onPreRenderField(fieldName, (schema, ctx) => {
                    makeFieldReadonly(fieldName, schema, ctx);
                })
                .onPostRenderField(fieldName, (schema: SPClientTemplates.FieldSchema_InForm_User, ctx) => {
                    makePeoplePickerReadOnly(fieldName,schema,ctx);
                });
        }

        makeHidden(fieldName: string): ICSR {
            return this.onPreRenderField(fieldName, (schema, ctx) => {
                makeFieldHidden(fieldName, schema, ctx);
            });
        }

        filteredLookup(fieldName: string, camlFilter: string, listname?: string, lookupField?: string): ICSR {
            var SPFieldCascadedLookup_Edit = new LookupFieldFilteredTemplate(fieldName, camlFilter, listname, lookupField);
            return this.fieldEdit(fieldName, SPFieldCascadedLookup_Edit.renderField)
                .fieldNew(fieldName, SPFieldCascadedLookup_Edit.renderField);
        }

        koEditField(fieldName: string, template: string, vm: IKoFieldInForm, dependencyFields?: string[]): ICSR {
            var koEditField_Edit = new koEditFieldTemplate(fieldName, template, vm, dependencyFields);
            return this.fieldEdit(fieldName, koEditField_Edit.renderField)
                .fieldNew(fieldName, koEditField_Edit.renderField);
        }

        computedValue(targetField: string, transform: (...values: string[]) => string, ...sourceField: string[]): ICSR {
            var dependentValues: { [field: string]: string } = {};

            return this.onPostRenderField(targetField, (schema, ctx: SPClientTemplates.RenderContext_FieldInForm) => {
                computedValue(targetField, dependentValues, transform, schema, ctx, ...sourceField);
            });
        }

        setInitialValue(fieldName: string, value: any, ignoreNull?: boolean): ICSR {
            if (value || !ignoreNull) {
                return this.onPreRenderField(fieldName, (schema, ctx: SPClientTemplates.RenderContext_FieldInForm) => {
                    ctx.ListData.Items[0][fieldName] = value;
                });
            } else {
                return this;
            }
        }

        autofill(fieldName: string, init: (ctx: IAutoFillFieldContext) => void): ICSR {
            var SPFieldLookup_Autofill_Edit = new AutoFillLookupField(fieldName, init);
            return this
                .fieldNew(fieldName, SPFieldLookup_Autofill_Edit.renderField)
                .fieldEdit(fieldName, SPFieldLookup_Autofill_Edit.renderField);
        }

        seachLookup(fieldName: string): ICSR {
            return this.autofill(fieldName, (ctx: IAutoFillFieldContext) => {
                searchLookup(fieldName, ctx);
            });
        }

        lookupAddNew(fieldName: string, prompt: string, showDialog?: boolean, contentTypeId?: string): ICSR {
            return this.onPostRenderField(fieldName,
                (schema: SPClientTemplates.FieldSchema_InForm_Lookup, ctx: SPClientTemplates.RenderContext_FieldInForm) => {
                    lookupAddNew(fieldName,prompt,showDialog,contentTypeId,schema,ctx);
                });
        }

        register() {
            if (!this.IsRegistered) {
                SPClientTemplates.TemplateManager.RegisterTemplateOverrides(this);
                this.IsRegistered = true;
            }
        }
    }

    export class AutoFillOptionBuilder {

        static buildFooterItem(title: string): ISPClientAutoFillData {
            var item = {};

            item[SPClientAutoFill.DisplayTextProperty] = title;
            item[SPClientAutoFill.MenuOptionTypeProperty] = SPClientAutoFill.MenuOptionType.Footer;

            return item;
        }

        static buildOptionItem(id: number, title: string, displayText?: string, subDisplayText?: string): ISPClientAutoFillData {

            var item = {};

            item[SPClientAutoFill.KeyProperty] = id;
            item[SPClientAutoFill.DisplayTextProperty] = displayText || title;
            item[SPClientAutoFill.SubDisplayTextProperty] = subDisplayText;
            item[SPClientAutoFill.TitleTextProperty] = title;
            item[SPClientAutoFill.MenuOptionTypeProperty] = SPClientAutoFill.MenuOptionType.Option;

            return item;
        }

        static buildSeparatorItem(): ISPClientAutoFillData {
            var item = {};
            item[SPClientAutoFill.MenuOptionTypeProperty] = SPClientAutoFill.MenuOptionType.Separator;
            return item;
        }

        static buildLoadingItem(title: string): ISPClientAutoFillData {
            var item = {};

            item[SPClientAutoFill.MenuOptionTypeProperty] = SPClientAutoFill.MenuOptionType.Loading;
            item[SPClientAutoFill.DisplayTextProperty] = title;
            return item;
        }

    }

    export function ensureFormContextHookField(hook: IFormContextHook, fieldName: string): IFormContextHookField {
        return hook[fieldName] = hook[fieldName] || {
            updatedValueCallbacks: []
        };

    }

    export class BooleanValueValidator implements SPClientForms.ClientValidation.IValidator {
        constructor(public valueGetter: () => boolean, public validationMessage: string) { }

        Validate(value: any): SPClientForms.ClientValidation.ValidationResult {
            return new SPClientForms.ClientValidation.ValidationResult(!this.valueGetter(), this.validationMessage);
        }
    }

}

if (typeof SP == 'object' && SP && typeof SP.SOD == 'object' && SP.SOD) {
    SP.SOD.notifyScriptLoadedAndExecuteWaitingJobs("typescripttemplates.js");
}