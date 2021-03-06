// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  JupyterLab, JupyterLabPlugin
} from '../application';

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
  AboutModel, AboutWidget
} from './';

/**
 * The about page extension.
 */
const plugin: JupyterLabPlugin<void> = {
  id: 'jupyter.extensions.about',
  activate: activateAbout,
  autoStart: true,
  requires: [ICommandPalette, ILayoutRestorer]
};


/**
 * Export the plugin as default.
 */
export default plugin;


function activateAbout(app: JupyterLab, palette: ICommandPalette, layout: ILayoutRestorer): void {
  const namespace = 'about-jupyterlab';
  const model = new AboutModel();
  const command = `${namespace}:show`;
  const category = 'Help';
  const tracker = new InstanceTracker<AboutWidget>({ namespace });

  layout.restore(tracker, {
    command,
    args: () => null,
    name: () => 'about'
  });

  let widget: AboutWidget;

  function newWidget(): AboutWidget {
    let widget = new AboutWidget();
    widget.model = model;
    widget.id = 'about';
    widget.title.label = 'About';
    widget.title.closable = true;
    tracker.add(widget);
    return widget;
  }

  app.commands.addCommand(command, {
    label: 'About JupyterLab',
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
