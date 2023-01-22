<script>
    import { TFile } from "obsidian";
    import Paragrapher from "main";
    // function to get the paragraph of a file

    async function parseParagraph(file: TFile): string {
        let fileContents = await app.vault.cachedRead(file);
        let paragraphs = fileContents.split("\n\n");
        let paragraph = paragraphs[randomNumber(0, paragraphs.length - 1)];
        return paragraph;
    }
    // sourcing form the plugins settings words per slide and file
    let wordsPerSlide = paragrapher.settings.wordsPerSlide;

    // Recursive Function to return the next number of words per slide into an array
    function getWordsPerSlide(words: string[]): number[] {
        const wordsPerSlide = paragrapher.settings.wordsPerSlide;
        if (words.length > wordsPerSlide) {
            return [wordsPerSlide, ...getWordsPerSlide(wordsPerSlide, words.slice(wordsPerSlide))];
        } else {
            return [words.length];
        }
    }


    
</script>
<div>
    <h1 class="Heads">{getWordsPerSlide()}</h1>
</div>
<style>
    .Heads {
        font-size: 2em;
        font-weight: bold;
        text-align: center;
    }

    .Paragrapher-Container {
        margin-left: auto;
        margin-right: auto;
        text-align: center;
    }

    .Paragrapher-Result {
        margin-left: auto;
        margin-right: auto;
        text-align: center;
    }

</style>
