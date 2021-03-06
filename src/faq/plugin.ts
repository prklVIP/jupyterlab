// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  JupyterLab, JupyterLabPlugin
} from '../application';

import {
  ICommandLinker
} from '../commandlinker';

import {
  ICommandPalette
} from '../commandpalette';

import {
  InstanceTracker
} from '../common/instancetracker';

import {
  ILayoutRestorer
} from '../layoutrestorer';

import {
  FaqModel, FaqWidget
} from './widget';


/**
 * The FAQ page extension.
 */
const plugin: JupyterLabPlugin<void> = {
  id: 'jupyter.extensions.faq',
  requires: [ICommandPalette, ICommandLinker, ILayoutRestorer],
  activate: activateFAQ,
  autoStart: true
};


/**
 * Export the plugin as default.
 */
export default plugin;


/**
 * Activate the FAQ plugin.
 */
function activateFAQ(app: JupyterLab, palette: ICommandPalette, linker: ICommandLinker, layout: ILayoutRestorer): void {
  const category = 'Help';
  const command = 'faq-jupyterlab:show';
  const model = new FaqModel();
  const tracker = new InstanceTracker<FaqWidget>({ namespace: 'faq' });

  // Handle state restoration.
  layout.restore(tracker, {
    command,
    args: () => null,
    name: () => 'faq'
  });

  let widget: FaqWidget;

  function newWidget(): FaqWidget {
    let widget = new FaqWidget({ linker });
    widget.model = model;
    widget.id = 'faq';
    widget.title.label = 'FAQ';
    widget.title.closable = true;
    tracker.add(widget);
    return widget;
  }

  app.commands.addCommand(command, {
    label: 'Frequently Asked Questions',
    execute: () => {
      if (!widget || widget.isDisposed) {
        widget = newWidget();
        app.shell.addToMainArea(widget);
      }
      app.shell.activateMain(widget.id);
    }
  });

  palette.addItem({ command, category });
}
