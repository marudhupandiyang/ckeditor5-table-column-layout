import * as tableFuncs from "@ckeditor/ckeditor5-table/src/commands/utils";
import toMap from "@ckeditor/ckeditor5-utils/src/tomap";
import { IWriter } from "../interfaces/iwriter.interface";

export default class TableBorderCommand {
    private validElements = ['tableRow', 'tableCell', 'table'];

    constructor(private editor: any) {
    }

    private addClassToNodes(node: any, writer: IWriter): void {
        if (this.validElements.indexOf(node.name) > -1) {
            let attributes = toMap(node.getAttributes());
            if (attributes.has("class")) {
                writer.removeAttribute("class", node);
            } else {
                writer.setAttribute("class", "no-border", node);
            }
            let childCount = node.childCount;
            for (let i = 0; i < childCount; i++) {
                let child = node._children.getNode(i);
                this.addClassToNodes(child, writer);
            }
        }
    }

    public execute(): void {
        let model = this.editor.model;
        let selection = model.document.selection;
        let tableCell = tableFuncs.findAncestor('tableCell', selection.getFirstPosition());
        let tableRow = tableCell.parent;
        let table = tableRow.parent;

        model.change((writer: IWriter) => {
            this.addClassToNodes(table, writer);
        });
    }
}
