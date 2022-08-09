import * as vscode from 'vscode'

import type { Options, UriStoreValue } from './types'
import { parseDiagnostic } from './parse-diagnostic'

const EXTENSION_OPTION_KEY = 'betterTypeScriptErrors'
const defaultOptions: Options = {
  showParsedMessages: true,
}

let options = defaultOptions

export function activate(context: vscode.ExtensionContext) {
  console.info('Activating `better-ts-errors`')
  const uriStore: Record<vscode.Uri['path'], UriStoreValue[]> = {}

  const updateOptions = () => {
    options = {
      ...defaultOptions,
      ...vscode.workspace.getConfiguration(EXTENSION_OPTION_KEY),
    }
  }

  updateOptions()

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(config => {
      if (config.affectsConfiguration(EXTENSION_OPTION_KEY)) {
        updateOptions()
      }
    }),
  )

  const hoverProvider: vscode.HoverProvider = {
    provideHover: (document, position) => {
      const itemsInUriStore = uriStore[document.uri.path]

      if (!itemsInUriStore) {
        return null
      }

      const itemInRange = itemsInUriStore.find(item =>
        item.range.contains(position),
      )

      return itemInRange
    },
  }

  context.subscriptions.push(
    vscode.languages.registerHoverProvider(
      {
        scheme: 'file',
        language: 'typescript',
      },
      hoverProvider,
    ),
    vscode.languages.registerHoverProvider(
      {
        scheme: 'file',
        language: 'typescriptreact',
      },
      hoverProvider,
    ),
  )

  context.subscriptions.push(
    vscode.languages.onDidChangeDiagnostics(event => {
      const { uris } = event
      const urisLength = uris.length
      let uriIndex = 0

      while (uriIndex < urisLength) {
        const items: UriStoreValue[] = []
        const uri = uris[uriIndex]

        const diagnostics = vscode.languages.getDiagnostics(uri)
        const diagnosticsLength = diagnostics.length
        let diagnosticIndex = 0

        while (diagnosticIndex < diagnosticsLength) {
          const diagnostic = diagnostics[diagnosticIndex]
          const errorMarkdown = parseDiagnostic(diagnostic, options)

          if (errorMarkdown) {
            items.push({
              range: diagnostic.range,
              contents: [errorMarkdown],
            })
          }

          ++diagnosticIndex
        }

        uriStore[uri.path] = items
        ++uriIndex
      }
    }),
  )
}

export function deactivate() {
  console.info('Deactivating `better-ts-errors`')
}
