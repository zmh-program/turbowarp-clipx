export default interface Option {
    id: string;
    name?: string;    // Defaults to extension ID if not specified.
    color1?: string;  // Should be a hex color code.
    color2?: string;  // Should be a hex color code.
    color3?: string;  // Should be a hex color code.
    menuIconURI?: string;    // Should be a data: URI
    blockIconURI?: string;   // Should be a data: URI
    docsURI?: string;
    blocks: object[];
}