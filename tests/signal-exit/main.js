var paraquire = require('paraquire')(module);

var se = paraquire('signal-exit', {builtin: ['assert', 'events'], sandbox: {process: process}});
paraquire('signal-exit', {builtin: ['assert', 'events'], sandbox: {process: process}});
paraquire('signal-exit/signals.js', {builtin: ['assert', 'events'], sandbox: {process: process}});
