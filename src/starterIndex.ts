import { App, ItemView, Platform, Plugin, PluginSettingTab, Setting, WorkspaceLeaf } from 'obsidian';

import DiceRoller from './ui/DIceRoller.svelte';

const VIEW_TYPE = "svelte-view";

// Remember to rename these classes and interfaces!

interface ParagrapherSettings {
    mySetting: string,
    wpm: number, 
    wordsPerSlide: number
}

const DEFAULT_SETTINGS: ParagrapherSettings = {
    mySetting: 'default',
    wpm: 200, 
    wordsPerSlide: 10
}


class MySvelteView extends ItemView {
    view: DiceRoller;

    getViewType(): string {
        return VIEW_TYPE;
    }

    getDisplayText(): string {
        return "Dice Roller";
    }

    getIcon(): string {
        return "dice";
    }

    async onOpen(): Promise<void> {

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.view = new DiceRoller({ target: (this as any).contentEl, props: {} });
    }
}

export default class Paragrapher extends Plugin {
    private view: MySvelteView;
    settings: ParagrapherSettings;

    async onload() {
        await this.loadSettings();

        this.registerView(
            VIEW_TYPE,
            (leaf: WorkspaceLeaf) => (this.view = new MySvelteView(leaf))
        );

        this.app.workspace.onLayoutReady(this.onLayoutReady.bind(this));

        // This creates an icon in the left ribbon.
        this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => this.openMapView());

        // This adds a simple command that can be triggered anywhere
        this.addCommand({
            id: 'open-sample-modal-simple',
            name: 'Open sample modal (simple)',
            callback: () => this.openMapView(),
        });
        // This adds a settings tab so the user can configure various aspects of the plugin
        this.addSettingTab(new SampleSettingTab(this.app, this));
    }

    onLayoutReady(): void {
        if (this.app.workspace.getLeavesOfType(VIEW_TYPE).length) {
            return;
        }
        this.app.workspace.getRightLeaf(false).setViewState({
            type: VIEW_TYPE,
        });
    }

    onunload() {

    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    async openMapView() {
        const workspace = this.app.workspace;
        workspace.detachLeavesOfType(VIEW_TYPE);
        const leaf = workspace.getLeaf(
            // @ts-ignore
            !Platform.isMobile
        );
        await leaf.setViewState({ type: VIEW_TYPE });
        workspace.revealLeaf(leaf);
    }
}

class SampleSettingTab extends PluginSettingTab {
    plugin: Paragrapher;

    constructor(app: App, plugin: Paragrapher) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        containerEl.createEl('h2', { text: 'Settings for my awesome plugin.' });

        new Setting(containerEl)
            .setName('Setting #1')
            .setDesc('It\'s a secret')
            .addText(text => text
                .setPlaceholder('Enter your secret')
                .setValue(this.plugin.settings.mySetting)
                .onChange(async (value) => {
                    this.plugin.settings.mySetting = value;
                    await this.plugin.saveSettings();
                }));
        new Setting(containerEl)
            .setName('Words per minute')
            .setDesc('Words per minute')
            .addText(text => text
                .setPlaceholder('Enter your wpm')
                .setValue(this.plugin.settings.wpm.toString())
                .onChange(async (value) => {
                    this.plugin.settings.wpm = parseInt(value);
                    await this.plugin.saveSettings();
                }
                ));
        new Setting(containerEl)
            .setName('Words per slide')
            .setDesc('Words per slide')
            .addText(text => text
                .setPlaceholder('Enter your words per slide')
                .setValue(this.plugin.settings.wordsPerSlide.toString())
                .onChange(async (value) => {
                    this.plugin.settings.wordsPerSlide = parseInt(value);
                    await this.plugin.saveSettings();
                }
                ));
                
                

    }
}
