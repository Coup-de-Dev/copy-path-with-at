import * as vscode from 'vscode';
import { promises as fs } from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    let lastSelectedUri: vscode.Uri | undefined;
    
    // Fonction commune pour copier le chemin
    async function copyPathWithAt(targetUri: vscode.Uri | undefined) {
        try {
            if (!targetUri) {
                // Si pas d'URI fourni, essayer plusieurs sources
                if (vscode.window.activeTextEditor) {
                    targetUri = vscode.window.activeTextEditor.document.uri;
                } else {
                    const workspaceFolders = vscode.workspace.workspaceFolders;
                    if (workspaceFolders && workspaceFolders.length > 0) {
                        targetUri = workspaceFolders[0].uri;
                    }
                }
            }
            
            if (!targetUri) {
                const message = 'Aucun fichier ou dossier disponible. Ouvrez un fichier ou sélectionnez un élément dans l\'explorateur.';
                vscode.window.showErrorMessage(message);
                return;
            }

            const filePath = targetUri.fsPath;
            const stat = await vscode.workspace.fs.stat(targetUri);
            
            let result: string;
            
            if (stat.type === vscode.FileType.Directory) {
                result = await getAllFilesInDirectory(filePath);
            } else {
                result = '@' + filePath;
            }
            
            await vscode.env.clipboard.writeText(result);
            vscode.window.showInformationMessage(`Chemin(s) copié(s) dans le presse-papier: ${result.split('\n').length} élément(s)`);
            
        } catch (error) {
            vscode.window.showErrorMessage(`Erreur: ${error}`);
        }
    }
    
    // Commande normale (menu contextuel et éditeur)
    const disposable1 = vscode.commands.registerCommand('copyPathWithAt.copyPath', async (uri: vscode.Uri, uris?: vscode.Uri[]) => {
        
        // Si sélection multiple
        if (uris && uris.length > 0) {
            const results: string[] = [];
            
            for (const selectedUri of uris) {
                try {
                    const stat = await vscode.workspace.fs.stat(selectedUri);
                    
                    if (stat.type === vscode.FileType.Directory) {
                        const dirFiles = await getAllFilesInDirectory(selectedUri.fsPath);
                        results.push(dirFiles);
                    } else {
                        results.push('@' + selectedUri.fsPath);
                    }
                } catch (error) {
                        }
            }
            
            const finalResult = results.join('\n');
            await vscode.env.clipboard.writeText(finalResult);
            vscode.window.showInformationMessage(`Chemin(s) copié(s) dans le presse-papier: ${finalResult.split('\n').filter(line => line.trim()).length} élément(s)`);
        } else {
            // Si appelé depuis le menu contextuel, stocker l'URI
            if (uri) {
                lastSelectedUri = uri;
            }
            await copyPathWithAt(uri);
        }
    });

    // Commande pour copier le chemin avec @ - approche directe
    const disposable2 = vscode.commands.registerCommand('copyPathWithAt.interceptCopy', async () => {
        
        try {
            let targetUri: vscode.Uri | undefined;
            
            interface FileQuickPickItem extends vscode.QuickPickItem {
                uri: vscode.Uri;
            }
            
            const allFiles = await vscode.workspace.findFiles('**/*', '**/node_modules/**', 1000);
            const quickPickItems: FileQuickPickItem[] = allFiles
                .sort((a, b) => a.fsPath.localeCompare(b.fsPath))
                .map(uri => ({
                    label: vscode.workspace.asRelativePath(uri),
                    description: path.dirname(uri.fsPath),
                    uri: uri
                }));
            
            const selectedItem = await vscode.window.showQuickPick(quickPickItems, { 
                placeHolder: 'Sélectionnez le fichier/dossier à copier avec @',
                canPickMany: false
            });
            if (!selectedItem) {
                return;
            }
            
            targetUri = selectedItem.uri;
            
            const filePath = targetUri.fsPath;
            let result: string;
            
            try {
                const stat = await vscode.workspace.fs.stat(targetUri);
                
                if (stat.type === vscode.FileType.Directory) {
                        result = await getAllFilesInDirectory(filePath);
                } else {
                        result = '@' + filePath;
                }
            } catch (error) {
                result = '@' + filePath;
            }
            
            await vscode.env.clipboard.writeText(result);
            vscode.window.showInformationMessage(`Chemin(s) avec @ copié(s) dans le presse-papier: ${result.split('\n').length} élément(s)`);
            
        } catch (error) {
            vscode.window.showErrorMessage(`Erreur: ${error}`);
        }
    });

    // Écouter les clics dans l'explorateur pour tracker les sélections
    const disposable3 = vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (editor) {
            lastSelectedUri = editor.document.uri;
        }
    });

    context.subscriptions.push(disposable1, disposable2, disposable3);
}

async function getAllFilesInDirectory(dirPath: string): Promise<string> {
    const files: string[] = [];
    
    async function walkDirectory(currentPath: string) {
        try {
            const entries = await fs.readdir(currentPath, { withFileTypes: true });
            
            for (const entry of entries) {
                const fullPath = path.join(currentPath, entry.name);
                
                if (entry.isDirectory()) {
                    await walkDirectory(fullPath);
                } else if (entry.isFile()) {
                    files.push('@' + fullPath);
                }
            }
        } catch (error) {
        }
    }
    
    await walkDirectory(dirPath);
    return files.join('\n');
}

export function deactivate() {}