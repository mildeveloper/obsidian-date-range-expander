export class App {
    vault: any;
    workspace: any;
    metadataCache: any;
}

export class Notice {
    constructor(message: string, timeout?: number) {}
}

export class TFolder {
    path: string;
    constructor() {
        this.path = '';
    }
}

// Add any other Obsidian classes/types you need to mock 