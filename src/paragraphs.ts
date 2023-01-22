import type { Vault } from 'obsidian';



// Function to return a string of a paragraph from a file
export async function getParagraph(vault: Vault, file: string, paragraph: number): Promise<string> {
    
        // Get the file contents
        const contents = await vault.cachedRead(file);
        
        // Split the file into paragraphs
        const paragraphs = contents.split(/\r?\n\r?\n/);

        // Return the paragraph
        return paragraphs[paragraph];
}

