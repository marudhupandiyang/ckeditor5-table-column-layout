import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
// import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';
import TableUtils from '@ckeditor/ckeditor5-table/src/tableutils';
import { findOptimalInsertionPosition } from '@ckeditor/ckeditor5-widget/src/utils';
import LayoutIcon from './layout.svg';

class NewspaperLayout extends Plugin {
  init() {
    console.log( 'NewspaperLayout was initialized' );
    const editor = this.editor;

    editor.model.schema.extend( 'table', {
      allowAttributes: 'type'
    } );

    editor.conversion.attributeToAttribute( {
      model: {
        name: 'table',
        key: 'type',
      },
      view: {
        name: 'figure',
        key: 'class',
        value: 'column-layout',
      },
    });

    editor.ui.componentFactory.add( 'insertLayout', locale => {
      const view = new ButtonView( locale );

      view.set( {
          label: 'Insert Layout',
          icon: LayoutIcon,
          tooltip: true
      } );

      // Callback executed once the image is clicked.
      view.on( 'execute', () => {
        const model = this.editor.model;
        const selection = model.document.selection;
        const tableUtils = this.editor.plugins.get( 'TableUtils' );

        const rows = 1;
        const columns = 2;

        const insertPosition = findOptimalInsertionPosition( selection, model );

        model.change( writer => {
          const table = tableUtils.createTable( writer, rows, columns );
          writer.setAttribute('type', 'column-layout', table);

          model.insertContent( table, insertPosition );

          writer.setSelection( writer.createPositionAt( table.getNodeByPath( [ 0, 0, 0 ] ), 0 ) );
        } );
      });

      return view;
    });
  }
}

export default NewspaperLayout;
