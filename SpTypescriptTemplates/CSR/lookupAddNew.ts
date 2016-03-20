module CSR {
    export function lookupAddNew(fieldName: string, prompt: string, showDialog: boolean, contentTypeId: string, schema: SPClientTemplates.FieldSchema_InForm_Lookup, ctx: SPClientTemplates.RenderContext_FieldInForm) {
        if (ctx.ControlMode == SPClientTemplates.ClientControlMode.EditForm
            || ctx.ControlMode == SPClientTemplates.ClientControlMode.NewForm)

            var control = CSR.getControl(schema);
        if (control) {
            var weburl = _spPageContextInfo.webServerRelativeUrl;
            if (weburl[weburl.length - 1] == '/') {
                weburl = weburl.substring(0, weburl.length - 1);
            }
            var newFormUrl = weburl + '/_layouts/listform.aspx/listform.aspx?PageType=8'
                + "&ListId=" + encodeURIComponent('{' + schema.LookupListId + '}');
            if (contentTypeId) {
                newFormUrl += '&ContentTypeId=' + contentTypeId;
            }

            var link = document.createElement('a');
            link.href = "javascript:NewItem2(event, \'" + newFormUrl + "&Source=" + encodeURIComponent(document.location.href) + "')";
            link.textContent = prompt;
            if (control.nextElementSibling) {
                control.parentElement.insertBefore(link, control.nextElementSibling);
            } else {
                control.parentElement.appendChild(link);
            }

            if (showDialog) {
                $addHandler(link, "click", (e: Sys.UI.DomEvent) => {
                    SP.SOD.executeFunc('sp.ui.dialog.js', 'SP.UI.ModalDialog.ShowPopupDialog', () => {
                        SP.UI.ModalDialog.ShowPopupDialog(newFormUrl);
                    });
                    e.stopPropagation();
                    e.preventDefault();
                });
            }
        }
    }
}