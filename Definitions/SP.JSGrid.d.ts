declare module SP {
    export module JsGrid {


        export class JsGridControl {
            constructor(parentNode: HTMLElement, bShowLoadingBanner: boolean);
            /** Returns true if Init method has been executed successfully */
            IsInitialized(): boolean;
            /** Replaces the control TableCache object with the provided one */
            ResetData(cache: SP.JsGrid.TableCache): void;
            /** Initialize the control */
            Init(parameters: SP.JsGrid.JsGridControl.Parameters): void;
            Cleanup(): void;
            /** Removes all event handlers and markup associated with the control */
            Dispose(): void;

            // todo
            NotifyDataAvailable(): void;
            NotifySave(): void;
            NotifyHide(): void;
            NotifyResize(): void;
            ClearTableView(): void;
            HideInitialLoadingBanner(): void;
            ShowInitialGridErrorMsg(errorMsg: string): void;
            ShowGridErrorMsg(errorMsg: string): void;
            LaunchPrintView(additionalScriptFiles, beforeInitFnName, beforeInitFnArgsObj, title, bEnableGantt, optGanttDelegateNames, optInitTableViewParamsFnName, optInitTableViewParamsFnArgsObj, optInitGanttStylesFnName, optInitGanttStylesFnArgsObj): void;
            GetAllDataJson(fnOnFinished, optFnGetCellStyleID?): void;
            SetTableView(tableViewParams): void;
            SetRowView(rowViewParams): void;

            /** Enable grid after Disable. */
            Enable(): void;
            /** Covers the grid with the semi-transparent panel, preventing any operations with it.
                Additionally, displays loading animated gif and optMsg as the message next to it.
                If optMsg is not specified, displays "Loading..." text. */
            Disable(optMsg?: string): void;
            /** Enables grid editing */
            EnableEditing(): void;
            /** Disables grid editing: all the records become readonly */
            DisableEditing(): void;
            /** Switches the currently selected cell into edit mode: displays edit control and sets focus into it.
                Returns true if success. */
            TryBeginEdit(): boolean;
            FinalizeEditing(fnContinue, fnError): void;
            /** Get diff tracker object that tracks changes to the grid data. */
            GetDiffTracker(): SP.JsGrid.Internal.DiffTracker;
            /** Moves focus to the JsGrid control */
            Focus(): void;

            /** Try saving the new record row (aka entry row) if it was edited. */
            TryCommitFirstEntryRecords(fnCommitComplete: { (): void }): void;
            /** Removes all new record rows (aka entry rows), including unsaved and even empty ones.
                The latter seems to be a bug, as I haven't found any easy way to restore the empty entry row. */
            ClearUncommitedEntryRecords(): void;
            /** Returns true if there are any unsaved new record rows (aka entry rows). */
            AnyUncommitedEntryRecords(): boolean;


            // todo
            AnyUncomittedProvisionalRecords(): boolean;

            /** Gets record based on the recordKey
                @recordKey internal unique id of a row. You can get recordKey from view index via GetRecordKeyByViewIndex method. */
            GetRecord(recordKey: number): IRecord;
            /** Get entry record with the specified key.
                Entry record is a special type of record because it represents a new record that doesn't exist yet. */
            GetEntryRecord(key): any;
            /** Determine if the specified record key identifies valid entry row. */
            IsEntryRecord(recordKey: number): boolean;
            /** Determine whether the specified cell is editable. */
            IsCellEditable(record: IRecord, fieldKey: string, optPaneId?): boolean;
            /** Adds one of builtin row state indicator icons into the row header.
                Please pass one of the values of SP.JsGrid.RowHeaderStyleId
                Row header is the leftmost gray column of the table. */
            AddBuiltInRowHeaderState(recordKey: number, rowHeaderStateId: string): void;
            /** Adds the specified state into the row header.
                There can be several row header states for one row. Only one is shown (according to the Priority).
                Row header is the leftmost gray column of the table. */
            AddRowHeaderState(recordKey: number, rowHeaderState: SP.JsGrid.RowHeaderState): void;
            /** Removes header state with specified id from the row. */
            RemoveRowHeaderState(recordKey: number, rowHeaderStateId: string): void;

            GetCheckSelectionManager(): any;
            UpdateProperties(propertyUpdates, changeName, optChangeKey?): any;
            GetLastRecordKey(): string;
            InsertProvisionalRecordBefore(beforeRecordKey: number, newRecord, initialValues): any;
            InsertProvisionalRecordAfter(afterRecordKey: number, newRecord, initialValues): any;
            IsProvisionalRecordKey(recordKey: number): boolean;
            InsertRecordBefore(beforeRecordKey: number, newRecord, optChangeKey?): any;
            InsertRecordAfter(afterRecordKey: number, newRecord, optChangeKey?): any;
            InsertHiddenRecord(recordKey: number, changeKey, optAfterRecordKey?): any;
            DeleteRecords(recordKeys, optChangeKey?): any;
            IndentRecords(recordKeys, optChangeKey?): any;
            OutdentRecords(recordKeys, optChangeKey?): any;
            ReorderRecords(beginRecordKey: number, endRecordKey: number, afterRecordKey: number, bSelectAfterwards: boolean): any;
            GetContiguousRowSelectionWithoutEntryRecords(): { begin; end; keys };
            CanMoveRecordsUpByOne(recordKeys): boolean;
            CanMoveRecordsDownByOne(recordKeys): boolean;
            MoveRecordsUpByOne(recordKeys): any;
            MoveRecordsDownByOne(recordKeys): any;
            GetReorderRange(recordKeys): any;
            GetNodeExpandCollapseState(recordKey): any;
            ToggleExpandCollapse(recordKey: number): void;

            /** Attach event handler to a particular event type */
            AttachEvent(eventType: JsGrid.EventType, fnOnEvent: { (args: IEventArgs): void }): void;
            /** Detach a previously set event handler */
            DetachEvent(eventType: JsGrid.EventType, fnOnEvent): void;

            /** Set a delegate. Delegates are way to replace default functionality with custom one. */
            SetDelegate(delegateKey: JsGrid.DelegateType, fn): void;
            /** Get current delegate. */
            GetDelegate(delegateKey: JsGrid.DelegateType): any;

            /** Re-render the specified row in the view.
                Usually not necessary. */
            RefreshRow(recordKey: number): void;
            /** Re-render all rows in the view.
                It can be used e.g. if you have some custom display controls and they are rendered differently depending on some external settings.
                In this case, if you update the external settings, obviously you have to then update the view for these settings to take effect. */
            RefreshAllRows(): void;
            /** Clears undo queue, and also differencies tracker state and versions manager state. */
            ClearChanges(): void;

            GetGanttZoomLevel(): any;
            SetGanttZoomLevel(level: any): void;
            ScrollGanttToDate(date): void;

            /** Get top record view index.
                You can then use GetRecordKeyByViewIndex to convert this value into the recordKey. */
            GetTopRecordIndex(): number;
            /** Get number of rows displayed in the current view. */
            GetViewRecordCount(): number;
            /** Get record key for a row that is specified by the viewIdx.
                viewIdx - index of the row in the view, use GetTopRecordIndex to get the first one.
                Returns recordKey, which is a unique numeric identifier of a row within a dataset.
                Main difference between viewIdx and recordKey is that viewIdx is only unique within a view,
                e.g. if you do paging, it can be same for different records.
             */
            GetRecordKeyByViewIndex(viewIdx: number): number;
            /** Opposite to GetRecordKeyByViewIndex, resolves the view index of the record based on record key.
                recordKey - unique numeric identifier of a row in the current dataset.
                Returns viewIdx - index of the row in the current view */
            GetViewIndexOfRecord(recordKey: number): number;
            /** Get top row index. Usually returns 0.
                You can then use GetRecordKeyByViewIndex to convert this value into the recordKey. */
            GetTopRowIndex(): number;

            GetOutlineLevel(record): any;
            GetSplitterPosition(): any;
            SetSplitterPosition(pos): void;
            GetLeftColumnIndex(optPaneId?): any;
            EnsurePaneWidth(): void;

            /** Show a previously hidden column at a specified position.
                If atIdx is not defined, column will be shown at it's previous position. */
            ShowColumn(columnKey: string, atIdx?: number): void;
            /** Hide the specified column from grid */
            HideColumn(columnKey: string): void;
            /** Update column descriptions */
            UpdateColumns(columnInfoCollection: ColumnInfoCollection): void;
            GetColumns(optPaneId?): ColumnInfo[];
            /** Get ColumnInfo object by fieldKey
                @fieldKey when working with SharePoint data sources, fieldKey corresponds to field internal name */
            GetColumnByFieldKey(fieldKey: string, optPaneId?): ColumnInfo;
            /** Adds a column, based on the specified grid field */
            AddColumn(columnInfo: ColumnInfo, gridField: GridField): void;

            /** Switches column header in rename mode, showing textbox and thus giving the user possibility to rename this column. */
            RenameColumn(columnKey: string): void;
            /** Shows a dialog where user can reorder columns and change their widths. */
            ShowColumnConfigurationDialog(): void;


            /** Returns true, if there are any errors in the JsGrid */
            AnyErrors(): boolean;
            /** Returns true, if there are any errors in a specified row */
            AnyErrorsInRecord(recordKey: number): boolean;
            /** Set error for the specified by recordKey and fieldKey cell.
                Returns id of the error, so that later you can clear the error using this id. */
            SetCellError(recordKey: number, fieldKey: string, errorMessage: string): number;
            /** Set error for the specified by recordKey row.
                In the leftmost column of this row, exclamation mark error indicator will appear.
                Clicking on this indicator will cause the specified error message appear in form of a reddish tooltip.
                Returns id of the error, so that later you can clear the error using this id. */
            SetRowError(recordKey: number, errorMessage: string): number;
            /** Clear specified by id error that was previously set on the specified by recordKey and fieldKey cell. */
            ClearCellError(recordKey: number, fieldKey: string, id: number): void;
            /** Clear all errors in the specified cell. */
            ClearAllErrorsOnCell(recordKey: number, fieldKey: string): void;
            /** Clear specified by id error that was previously set on the specified by recordKey row. */
            ClearRowError(recordKey: number, id: number): void;
            /** Clear all errors in the specified row. */
            ClearAllErrorsOnRow(recordKey: number): void;
            /** Get error message for the specified cell.
                If many errors are set on the cell, only first is returned.
                If there are no errors in the cell, returns null. */
            GetCellErrorMessage(recordKey: number, fieldKey: string): string;
            /** Get error message for the specified row.
                If many errors are set on the row, only first is returned.
                If there are no errors in the row, returns null. */
            GetRowErrorMessage(recordKey: number): string;
            /** This method is used mostly when you have a rather tall JSGrid and you want to ensure that user sees
                that some error has occured.
                You can specify the minId or/and filter function.
                If minId is specified, method searches for an error with first id which is greater than minId.
                Scrolls to the Returns the id of the found record.
                If there aren't any errors, that satisfy the conditions, method does nothing and returns null. */
            ScrollToAndExpandNextError(minId?: number, fnFilter?: { (recordKey: number, fieldKey: string, id: number): boolean }): any;
            /** Same as ScrollToAndExpandNextError, but searches within the specified record.
                recordKey should be not null, otherwise you'll get an exception.
                bDontExpand controls whether the error tooltip will be shown (if bDontExpand=true, tooltip will not be shown). */
            ScrollToAndExpandNextErrorOnRecord(minId?: number, recordKey?: number, fnFilter?: { (recordKey: number, fieldKey: string, id: number): boolean }, bDontExpand?: boolean): any;

            GetFocusedItem(): any;
            SendKeyDownEvent(eventInfo): any;
            /** Moves cursor to entry record (the row that is used to add new records) */
            JumpToEntryRecord(): void;

            SelectRowRange(rowIdx1, rowIdx2, bAppend, optPaneId?): void;
            SelectColumnRange(colIdx1, colIdx2, bAppend, optPaneId?): void;
            SelectCellRange(rowIdx1, rowIdx2, colIdx1, colIdx2, bAppend, optPaneId): void;
            SelectRowRangeByKey(rowKey1, rowKey2, bAppend, optPaneId?): void;
            SelectColumnRangeByKey(colKey1, colKey2, bAppend, optPaneId?): void;
            SelectCellRangeByKey(recordKey1: string, recordKey2: string, colKey1, colKey2, bAppend, optPaneId?): void;

            ChangeKeys(oldKey, newKey): void;
            GetSelectedRowRanges(optPaneId?): any;
            GetSelectedColumnRanges(optPaneId?): any;
            GetSelectedRanges(optPaneId?): any;
            MarkPropUpdateInvalid(recordKey: number, fieldKey, changeKey, optErrorMsg?): any;
            GetCurrentChangeKey(): any;
            CreateAndSynchronizeToNewChangeKey(): any;
            CreateDataUpdateCmd(bUseCustomInitialUpdate: boolean): any;
            IsChangeKeyApplied(changeKey): any;
            GetChangeKeyForVersion(version): any;
            TryReadPropForChangeKey(recordKey: number, fieldKey, changeKey): any;
            GetUnfilteredHierarchyMap(): any;
            GetHierarchyState(bDecompressGuidKeys: boolean): any;
            IsGroupingRecordKey(recordKey: number): boolean;
            IsGroupingColumnKey(recordKey: number): boolean;
            GetSelectedRecordKeys(bDuplicatesAllowed: boolean): any;
            /** Cut data from currently selected cells into the clipboard.
                Will not work if current selection contains entry row or readonly cells. */
            CutToClipboard(): void;
            /** Copy data from currently selected cells into the clipboard. */
            CopyToClipboard(): void;
            /** Paste data from clipboard into currently selected cells. */
            PasteFromClipboard(): void;
            TryRestoreFocusAfterInsertOrDeleteColumns(origFocus): void;
            /** Get undo manager for performing undo/redo operations programmatically. */
            GetUndoManager(): SP.JsGrid.CommandManager;
            /** Gets number of records visible in the current view, including the entry row. */
            GetVisibleRecordCount(): number;
            /** Returns index of the system RecordIndicatorCheckBoxColumn. If not present in the view, returns null. */
            GetRecordIndicatorCheckBoxColumnIndex(): number;
            /** Determines if the specified record is visible in the current view. */
            IsRecordVisibleInView(recordKey: number): boolean;
            GetHierarchyQueryObject(): any;
            GetSpCsrRenderCtx(): any;
        }

        export interface IChangeKey {
            Reserve(): void;
            Release(): void;
            GetVersionNumber(): number;
            CompareTo(changeKey: IChangeKey): number;
        }

        export enum EventType {
            OnCellFocusChanged,
            OnRowFocusChanged,
            OnCellEditBegin,
            OnCellEditCompleted,
            OnRightClick,
            OnPropertyChanged,
            OnRecordInserted,
            OnRecordDeleted,
            OnRecordChecked,
            OnCellErrorStateChanged,
            OnEntryRecordAdded,
            OnEntryRecordCommitted,
            OnEntryRecordPropertyChanged,
            OnRowErrorStateChanged,
            OnDoubleClick,
            OnBeforeGridDispose,
            OnSingleCellClick,
            OnInitialChangesForChangeKeyComplete,
            OnVacateChange,
            OnGridErrorStateChanged,
            OnSingleCellKeyDown,
            OnRecordsReordered,
            OnBeforePropertyChanged,
            OnRowEscape,
            OnBeginRenameColumn,
            OnEndRenameColumn,
            OnPasteBegin,
            OnPasteEnd,
            OnBeginRedoDataUpdateChange,
            OnBeginUndoDataUpdateChange
        }

        export enum DelegateType {
            ExpandColumnMenu,
            AddColumnMenuItems,
            Sort,
            Filter,
            InsertRecord,
            DeleteRecords,
            IndentRecords,
            OutdentRecords,
            IsRecordInsertInView,
            ExpandDelayLoadedHierarchyNode,
            AutoFilter,
            ExpandConflictResolution,
            GetAutoFilterEntries,
            LaunchFilterDialog,
            ShowColumnConfigurationDialog,
            GetRecordEditMode,
            GetGridRowStyleId,
            CreateEntryRecord,
            TryInsertEntryRecord,
            WillAddColumnMenuItems,
            NextPage,
            AddNewColumn,
            RemoveColumnFromView,
            ReorderColumnPositionInView,
            TryCreateProvisionalRecord,
            CanReorderRecords,
            AddNewColumnMenuItems,
            TryBeginPaste,
            AllowSelectionChange,
            GetFieldEditMode,
            GetFieldReadOnlyActiveState,
            OnBeforeRecordReordered
        }

        export enum ClickContext {
            SelectAllSquare,
            RowHeader,
            ColumnHeader,
            Cell,
            Gantt,
            Other
        }
        export enum RowHeaderStatePriorities {
            Dirty,
            Transfer,
            CellError,
            Conflict,
            RowError,
            NewRow
        }

        export class RowHeaderStyleId {
            static Transfer: string;
            static Conflict: string;
        }
        export class RowHeaderAutoStyleId {
            static Dirty: string;
            static Error: string;
            static NewRow: string;
        }
        export class RowHeaderState {
            constructor(id: string, img: SP.JsGrid.Image, priority: SP.JsGrid.RowHeaderStatePriorities, tooltip: string, fnOnClick: { (eventInfo, recordKey: number): void });
            GetId(): string;
            GetImg(): SP.JsGrid.Image;
            GetPriority(): SP.JsGrid.RowHeaderStatePriorities;
            GetOnClick(): { (eventInfo, recordKey: number): void };
            GetTooltip(): string;
            toString(): string;
        }

        export class Image {
            /** optOuterCssNames and optImgCssNames are strings that contain css class names separated by spaces.
                optImgCssNames are applied to the img tag.
                if bIsClustered, image is rendered inside div, and optOuterCssNames are applied to the div. */
            constructor(imgSrc: string, bIsClustered: boolean, optOuterCssNames: string, optImgCssNames: string, bIsAnimated: boolean);
            imgSrc: string;
            bIsClustered: boolean;
            optOuterCssNames: string;
            imgCssNames: string;
            bIsAnimated: boolean;
            /** Renders the image with specified alternative text and on-click handler.
                If bHideTooltip == false, then alternative text is also shown as the tooltip (title attribute). */
            Render(altText: string, clickFn: { (eventInfo: any): void }, bHideTooltip: boolean): HTMLElement;
        }

        export interface IEventArgs { }
        export module EventArgs {
            export class OnEntryRecordAdded implements IEventArgs {
                constructor(recordKey: number);
                recordKey: number;
            }

            export class CellFocusChanged implements IEventArgs {
                constructor(newRecordKey: number, newFieldKey: string, oldRecordKey: number, oldFieldKey: string);
                newRecordKey: number;
                newFieldKey: string;
                oldRecordKey: number;
                oldFieldKey: string;
            }

            export class RowFocusChanged implements IEventArgs {
                constructor(newRecordKey: number, oldRecordKey: number);
                newRecordKey: number;
                oldRecordKey: number;
            }
            export class CellEditBegin implements IEventArgs {
                constructor(recordKey: number, fieldKey: string);
                recordKey: number;
                fieldKey: string;
            }
            export class CellEditCompleted implements IEventArgs {
                constructor(recordKey: number, fieldKey: string, changeKey: JsGrid.IChangeKey, bCancelled: boolean);
                recordKey: number;
                fieldKey: string;
                changeKey: string;
                bCancelled: boolean;
            }
            export class Click implements IEventArgs {
                constructor(eventInfo, context: JsGrid.ClickContext, recordKey: number, fieldKey: string);
                eventInfo: any;
                context: JsGrid.ClickContext;
                recordKey: number;
                fieldKey: string;
            }
            export class PropertyChanged implements IEventArgs {
                constructor(recordKey, fieldKey, oldProp, newProp, propType, changeKey, validationState);
                recordKey: number;
                fieldKey: string;
                oldProp: any;
                newProp: any;
                propType: any;
                changeKey: JsGrid.IChangeKey;
                validationState: any;
            }
            export class RecordInserted implements IEventArgs {
                constructor(recordKey, recordIdx, afterRecordKey, changeKey);
                recordKey: number;
                recordIdx: number;
                afterRecordKey: number;
                changeKey: JsGrid.IChangeKey;
            }
            export class RecordDeleted implements IEventArgs {
                constructor(recordKey, recordIdx, changeKey);
                recordKey: number;
                recordIdx: number;
                changeKey: JsGrid.IChangeKey;
            }
            export class RecordChecked implements IEventArgs {
                constructor(recordKeySet: SP.Utilities.Set, bChecked: boolean);
                recordKeySet: SP.Utilities.Set;
                bChecked: boolean;
            }
            export class OnCellErrorStateChanged implements IEventArgs {
                constructor(recordKey, fieldKey, bAddingError, bCellCurrentlyHasError, bCellHadError, errorId);
                recordKey: number;
                fieldKey: string;
                bAddingError: boolean;
                bCellCurrentlyHasError: boolean;
                bCellHadError: boolean;
                errorId: number;
            }
            export class OnRowErrorStateChanged implements IEventArgs {
                constructor(recordKey, bAddingError, bErrorCurrentlyInRow, bRowHadError, errorId, message);
                recordKey: number;
                bAddingError: boolean;
                bErrorCurrentlyInRow: boolean;
                bRowHadError: boolean;
                errorId: number;
                message: string;
            }
            export class OnEntryRecordCommitted implements IEventArgs {
                constructor(origRecKey: string, recordKey: number, changeKey: JsGrid.IChangeKey);
                originalRecordKey: number;
                recordKey: number;
                changeKey: JsGrid.IChangeKey
            }
            export class SingleCellClick implements IEventArgs {
                constructor(eventInfo, recordKey: number, fieldKey: string);
                eventInfo: any;
                recordKey: number;
                fieldKey: string;
            }
            export class PendingChangeKeyInitiallyComplete implements IEventArgs {
                constructor(changeKey: JsGrid.IChangeKey);
                changeKey: JsGrid.IChangeKey
            }
            export class VacateChange implements IEventArgs {
                constructor(changeKey: JsGrid.IChangeKey);
                changeKey: JsGrid.IChangeKey
            }
            export class GridErrorStateChanged implements IEventArgs {
                constructor(bAnyErrors: boolean);
                bAnyErrors: boolean;
            }
            export class SingleCellKeyDown implements IEventArgs {
                constructor(eventInfo, recordKey: number, fieldKey: string);
                eventInfo: any;
                recordKey: number;
                fieldKey: string;
            }
            export class OnRecordsReordered implements IEventArgs {
                constructor(recordKeys: string[], changeKey: JsGrid.IChangeKey);
                reorderedKeys: string[];
                changeKey: JsGrid.IChangeKey;
            }
            export class OnRowEscape implements IEventArgs {
                constructor(recordKey: number);
                recordKey: number;
            }
            export class OnEndRenameColumn implements IEventArgs {
                constructor(columnKey: string, originalColumnTitle: string, newColumnTitle: string);
                columnKey: string;
                originalColumnTitle: string;
                newColumnTitle: string;
            }
            export class OnBeginRedoDataUpdateChange implements IEventArgs {
                constructor(changeKey: JsGrid.IChangeKey);
                changeKey: JsGrid.IChangeKey
            }
            export class OnBeginUndoDataUpdateChange implements IEventArgs {
                constructor(changeKey: JsGrid.IChangeKey);
                changeKey: JsGrid.IChangeKey
            }

        }

        export module JsGridControl {
            export class Parameters {
                tableCache: SP.JsGrid.TableCache;
                name: any; // TODO
                bNotificationsEnabled: boolean;
                styleManager: any; // TODO
                minHeaderHeight: number;
                minRowHeight: number;
                commandMgr: SP.JsGrid.CommandManager;
                enabledRowHeaderAutoStates: SP.Utilities.Set; // TODO

            }
        }

        export class CommandManager {
            // todo
        }

        export class TableCache {
            // todo
        }

        export class Style {

            static Type: {
                Splitter: {
                    outerBorderColor: any;
                    leftInnerBorderColor: any;
                    innerBorderColor: any;
                    backgroundColor: any;
                };
                SplitterHandle: {
                    outerBorderColor: any;
                    leftInnerBorderColor: any;
                    innerBorderColor: any;
                    backgroundColor: any;
                    gripUpperColor: any;
                    gripLowerColor: any;
                };
                GridPane: {
                    verticalBorderColor: any;
                    verticalBorderStyle: any;
                    horizontalBorderColor: any;
                    horizontalBorderStyle: any;
                    backgroundColor: any;
                    columnDropIndicatorColor: any;
                    rowDropIndicatorColor: any;
                    linkColor: any;
                    visitedLinkColor: any;
                    copyRectForeBorderColor: any;
                    copyRectBackBorderColor: any;
                    focusRectBorderColor: any;
                    selectionRectBorderColor: any;
                    selectedCellBgColor: any;
                    readonlySelectionRectBorderColor: any;
                    changeHighlightCellBgColor: any;
                    fillRectBorderColor: any;
                    errorRectBorderColor: any;
                };
                Header: {
                    font: any;
                    fontSize: any;
                    fontWeight: any;
                    textColor: any;
                    backgroundColor: any;
                    outerBorderColor: any;
                    innerBorderColor: any;
                    eyeBrowBorderColor: any;
                    eyeBrowColor: any;
                    menuColor: any;
                    menuBorderColor: any;
                    resizeColor: any;
                    resizeBorderColor: any;
                    menuHoverColor: any;
                    menuHoverBorderColor: any;
                    resizeHoverColor: any;
                    resizeHoverBorderColor: any;
                    eyeBrowHoverColor: any;
                    eyeBrowHoverBorderColor: any;
                    elementClickColor: any;
                    elementClickBorderColor: any;
                };
                RowHeaderStyle: any;
                TimescaleTier: any;
                Cell: {
                    /** -> CSS font-family */
                    font: any;
                    /** -> CSS font-size */
                    fontSize: any;
                    /** -> CSS font-weight */
                    fontWeight: any;
                    /** -> CSS font-style */
                    fontStyle: any;
                    /** -> CSS color */
                    textColor: any;
                    /** -> CSS background-color */
                    backgroundColor: any;
                    /** -> CSS text-align */
                    textAlign: any;
                };
                Widget: {
                    backgroundColor: any;
                    borderColor: any;
                }
            };

            static SetRTL: { (rtlObject): void; };
            static MakeJsGridStyleManager: { (): any };
            static CreateStyleFromCss: { (styleType, cssStyleName, optExistingStyle, optClassId): any; };
            static CreateStyle: { (styleType, styleProps): any; };
            static MergeCellStyles: { (majorStyle, minorStyle): any; };
            static ApplyCellStyle: { (td, style): void; };
            static ApplyRowHeaderStyle: { (domObj, style, fnGetHeaderSibling): void; };
            static ApplyCornerHeaderBorderStyle: { (domObj, colStyle, rowStyle): void; };
            static ApplyHeaderInnerBorderStyle: { (domObj, bIsRowHeader, headerObject): void };
            static ApplyColumnContextMenuStyle: { (domObj, style): void };
            static ApplySplitterStyle: { (domObj, style): void };
            static MakeBorderString: { (width: number, style: string, color: string): string };
            static GetCellStyleDefaultBackgroundColor: { (): string };

        }

        export class ColumnInfoCollection {
            constructor(colInfoArray: any[]);
            GetColumnByKey(key: string): any;
            GetColumnArray(bVisibleOnly?: boolean): any[];
            GetColumnMap(): { [key: string]: any; };
            AppendColumn(colInfo: any): void;
            InsertColumnAt(idx: number, colInfo: any): void;
            RemoveColumn(key: string): void;
            /** Returns null if the specified column is not found or hidden. */
            GetColumnPosition(key: string): number;
        }

        export class ColumnInfo {
            constructor(name: string, imgSrc: string, key: string, width: number);
            /** Column title */
            name: string;
            /** Column image URL.
                If not null, the column header cell will show the image instead of title text.
                If the title is defined at the same time as the imgSrc, the title will be shown as a tooltip. */
            imgSrc: string;
            /** Custom image HTML.
                If you define this in addition to the imgSrc attribute, then instead of standard img tag
                the custom HTML defined by this field will be used. */
            imgRawSrc: string;
            /** Column identifier */
            columnKey: string;
            /** Field keys of the fields, that are displayed in this column */
            fieldKeys: string[];
            /** Width of the column */
            width: number;
            bOpenMenuOnContentClick: boolean;
            /** always returns 'column' */
            ColumnType(): string;
            /** true by default */
            isVisible: boolean;
            /** true by default */
            isHidable: boolean;
            /** true by default */
            isResizable: boolean;
            /** true by default */
            isSortable: boolean;
            /** true by default */
            isAutoFilterable: boolean;
            /** false by default */
            isFooter: boolean;
            /** determine whether the cells in this column should be clickable */
            fnShouldLinkSingleValue: { (record: IRecord, fieldKey: string, dataValue: any, localizedValue: any): boolean };
            /** if a particular cell is determined as clickable by fnShouldLinkSingleValue, this function will be called when the cell is clicked */
            fnSingleValueClicked: { (record: IRecord, fieldKey: string, dataValue: any, localizedValue: any): void };
            /** this is used when you need to make some of the cells in the column readonly, but at the same time keep others editable */
            fnGetCellEditMode: { (record: IRecord, fieldKey: string): JsGrid.EditMode };
            /** this function should return name of the display control for the given cell in the column
                the name should be previously associated with the display control via SP.JsGrid.PropertyType.Utils.RegisterDisplayControl method */
            fnGetDisplayControlName: { (record: IRecord, fieldKey: string): string };
            /** this function should return name of the edit control for the given cell in the column
                the name should be previously associated with the edit control via SP.JsGrid.PropertyType.Utils.RegisterEditControl method */
            fnGetEditControlName: { (record: IRecord, fieldKey: string): string };
            /** set widget control names for a particular cell
                widgets are basically in-cell buttons with associated popup controls, e.g. date selector or address book button
                standard widget ids are defined in the SP.JsGrid.WidgetControl.Type enumeration
                it is also possible to create your own widgets 
                usually this function is not used, and instead, widget control names are determined via PropertyType
             */
            fnGetWidgetControlNames: { (record: IRecord, fieldKey: string): string[] };
            /** this function should return id of the style for the given cell in the column
                styles and their ids are registered for a JsGridControl via jsGridParams.styleManager.RegisterCellStyle method */
            fnGetCellStyleId: { (record: IRecord, fieldKey: string, dataValue: any): string };
            /** set custom tooltip for the given cell in the column. by default, localized value is displayed as the tooltip */
            fnGetSingleValueTooltip: { (record: IRecord, fieldKey: string, dataValue: any, localizedValue: any): string };
        }

        export enum EditMode {
            ReadOnly,
            ReadWrite,
            ReadOnlyDefer,
            ReadWriteDefer,
            Defer
        }

        export interface IRecord {
            /** True if this is an entry row */
            bIsNewRow: boolean;

            /** Please use SetProp and GetProp */
            properties: { [fieldKey: string]: IPropertyBase };

            /** returns recordKey */
            key(): number;
            /** returns raw data value for the specified field */
            GetDataValue(fieldKey: string): any;
            /** returns localized text value for the specified field */
            GetLocalizedValue(fieldKey: string): string;
            /** returns true if data value for the specified field is available */
            HasDataValue(fieldKey: string): boolean;
            /** returns true if localized text value for the specified field is available */
            HasLocalizedValue(fieldKey: string): boolean;

            GetProp(fieldKey: string): IPropertyBase;
            SetProp(fieldKey: string, prop: IPropertyBase): void;

            /** Update the specified field with the specified value */
            AddFieldValue(fieldKey: string, value: any): void;
            /** Removes value of the specified field.
                Does not refresh the view. */
            RemoveFieldValue(fieldKey: string): void;
        }


        export class RecordFactory {
            constructor(gridFieldMap: any, keyColumnName: string, fnGetPropType: any);
            gridFieldMap: any;
            /** Create a new record */
            MakeRecord(dataPropMap, localizedPropMap, bKeepRawData): IRecord;
        }

        export interface IPropertyBase {
            HasLocalizedValue(): boolean;
            HasDataValue(): boolean;
            Clone(): IPropertyBase;
            /** dataValue actually is cloned */
            Update(dataValue: any, localizedValue: string): void;
            GetLocalized(): string;
            GetData(): any;
        }

        export class Property {
            static MakeProperty(dataValue: any, localizedValue: string, bHasDataValue: boolean, bHasLocalizedValue: boolean, propType): IPropertyBase;
            static MakePropertyFromGridField(gridField: any, dataValue: any, localizedVal: string, optPropType?): IPropertyBase;
        }

        export class GridField {
            constructor(key: string, hasDataValue: boolean, hasLocalizedValue: boolean, textDirection, defaultCellStyleId, editMode, dateOnly, csrInfo);
            key: string;
            hasDataValue: boolean;
            hasLocalizedValue: boolean;
            textDirection: any;
            dateOnly: boolean;
            csrInfo: any;
            GetEditMode(): any;
            SetEditMode(mode: any): void;
            GetDefaultCellStyleId(): any;
            CompareSingleDataEqual(dataValue1, dataValue2): boolean;
            GetPropType(): any;
            GetSingleValuePropType(): any;
            GetMultiValuePropType(): any;
            SetSingleValuePropType(svPropType: any): void;
            SetIsMultiValue(listSeparator: any): void;
            GetIsMultiValue(): boolean;
        }

        export module WidgetControl {
            export class Type {
                static Demo: string;
                static Date: string;
                static AddressBook: string;
                static Hyperlink: string;
            }
        }

        export module Internal {
            export class DiffTracker {
                constructor(objBag, fnGetChange);
                ExternalAPI: {
                    AnyChanges(): boolean;
                    ChangeKeySliceInfo(): any;
                    ChangeQuery(): any;
                    EventSliceInfo(): any;
                    GetChanges(optStartEvent, optEndEvent, optRecordKeys, bFirstStartEvent: boolean, bStartInclusive: boolean, bEndInclusive: boolean, bIncludeInvalidPropUpdates: boolean, bLastEndEvent: boolean): any;
                    GetChangesAsJson(changeQuery, optfnPreProcessUpdateForSerialize?): string;
                    GetUniquePropertyChanges(changeQuery, optfnFilter): any;
                    RegisterEvent(changeKey: IChangeKey, eventObject): void;
                    UnregisterEvent(changeKey: IChangeKey, eventObject): void;
                };
                Clear(): void;
                NotifySynchronizeToChange(changeKey: IChangeKey): void;
                NotifyRollbackChange(changeKey: IChangeKey): void;
                NotifyVacateChange(changeKey: IChangeKey): void;
            }
        }

    }

    export module Utilities {
        export class Set {
            constructor(items?: { [item: string]: number });
            constructor(items?: { [item: number]: number });
            /** Returns true if the set is empty */
            IsEmpty(): boolean;
            /** Returns first item in the set */
            First(): any;
            /** Returns the underlying collection of items as dictionary.
                Items are the keys, and values are always 1.
                So the return value may be either { [item: string]: number } or { [item: number]: number } */
            GetCollection(): any;
            /** Returns all items from the set as an array */
            ToArray(): any[];
            /** Adds all items from array to the set, and returns the set */
            AddArray(array: any[]): SP.Utilities.Set;
            /** Adds an item to the set */
            Add(item: any): any;
            /** Removes the specified item from the set and returns the removed item */
            Remove(item: any): any;
            /** Clears all the items from set */
            Clear(): SP.Utilities.Set;
            /** Returns true if item exists in this set */
            Contains(item: any): boolean;
            /** Returns a copy of this set */
            Clone(): SP.Utilities.Set;
            /** Returns a set that contains all the items that exist only in one of the sets (this and other), but not in both */
            SymmetricDifference(otherSet: SP.Utilities.Set): SP.Utilities.Set; 
            /** Returns a set that contains all the items that are in this set but not in the otherSet */
            Difference(otherSet: SP.Utilities.Set): SP.Utilities.Set;
            /** Returns a new set, that contains items from this set and otherSet */
            Union(otherSet: SP.Utilities.Set): SP.Utilities.Set;
            /** Adds all items from otherSet to this set, and returns this set */
            UnionWith(otherSet: SP.Utilities.Set): SP.Utilities.Set;
            /** Returns a new set, that contains only items that exist both in this set and the otherSet */
            Intersection(otherSet: SP.Utilities.Set): SP.Utilities.Set;
        }
    }
}


