// X: #ff1242
// Y: #23d400
// Z: #0894ed

(async function() {
    let aboutAction, axisAction, axisDialog
    const id = "axis_color_customizer"
    const name = "Axis Color Customizer"
    const icon = "line_axis"
    const author = "SirJain"

    // Used in About dialog
    const links = {
        website: "https://sirjain0.github.io/",
        twitter: "https://twitter.com/SirJain2",
        discord: "https://discord.gg/wM4CKTbFVN"
    }

    // <body> HTML tag - CSS variable is stored here
    const body = document.getElementsByTagName("BODY")[0];

    // localStorage
    const xColor = localStorage.getItem("x_color");
    const yColor = localStorage.getItem("y_color");
    const zColor = localStorage.getItem("z_color");

    // Register plugin
    Plugin.register(id, {
        title: name,
        icon,
        author,
        description: "Customizes the colors of X, Y, and Z axes.",
        about: "To be filled out.",
        tags: ["Axis", "3D", "Color"],
        version: "1.0.0",
        min_version: "4.2.0",
        variant: "both",

        oninstall: () => showAbout(true),
        onload() {
            addAbout()
            updateAxisColors(xColor, yColor, zColor)

            axisDialog = new Dialog("change_axis_color_dialog", {
                name: "Change Axis Color",

                // Dialog form
                form: {
                    colorX: {
                        label: "X-Axis Color",
                        type: "color",
                        value: xColor ? xColor : "#ff1242"
                    },
                    colorY: {
                        label: "Y-Axis Color",
                        type: "color",
                        value: yColor ? yColor : "#23d400"
                    },
                    colorZ: {
                        label: "Z-Axis Color",
                        type: "color",
                        value: zColor ? zColor : "#0894ed"
                    }
                },

                component: {
                    
                    // Custom button to reset axis colors
                    template: `
                        <div style="display:flex; gap:8px; margin-top: 30px;">
                            <button @click="resetAxisColors()">Reset Axis Colors</button>
                            <span style="flex-grow:1"></span>
                        </div>
                    `,

                    methods: {
                        resetAxisColors() {
                            updateAxisColors("#ff1242", "#23d400", "#0894ed");

                            localStorage.setItem("x_color", "#ff1242");
                            localStorage.setItem("y_color", "#23d400");
                            localStorage.setItem("z_color", "#0894ed");

                            axisDialog.close();
                        }
                    }
                },

                onConfirm(formData) {
                    updateAxisColors(
                        formData.colorX.toHexString(),
                        formData.colorY.toHexString(),
                        formData.colorZ.toHexString()
                    )

                    localStorage.setItem("x_color", formData.colorX.toHexString());
                    localStorage.setItem("y_color", formData.colorY.toHexString());
                    localStorage.setItem("z_color", formData.colorZ.toHexString());
                }
            })
            
            axisAction = new Action({
                name: "Change Axis Color",
                id: "change_axis_color",
                icon: icon,
                click: () => axisDialog.show()
            })

            MenuBar.addAction(axisAction, "tools")
        },
        onunload() {
            aboutAction.delete();
            MenuBar.removeAction(`help.about_plugins.about_${id}`);
            MenuBar.removeAction(`tools.change_axis_color`);

            // Reset all values
            updateAxisColors("#ff1242", "#23d400", "#0894ed");
            localStorage.removeItem("x_color");
            localStorage.removeItem("y_color");
            localStorage.removeItem("z_color");

            Blockbench.showQuickMessage("Uninstalled Axis Color Customizer")
        }
    })

    // Update colors of all axes
    function updateAxisColors(colorX, colorY, colorZ) {
        updateAxisColorX(colorX);
        updateAxisColorY(colorY);
        updateAxisColorZ(colorZ);
    }

    // Update colors of individual axes 
    function updateAxisColorX(color) {
        body.style.setProperty("--color-axis-x", color);
        if (color != null) gizmo_colors.r = parseInt(color.substring(1), 16);
    }

    function updateAxisColorY(color) {
        body.style.setProperty("--color-axis-y", color);
        if (color != null) gizmo_colors.g = parseInt(color.substring(1), 16);
    }

    function updateAxisColorZ(color) {
        body.style.setProperty("--color-axis-z", color);
        if (color != null) gizmo_colors.b = parseInt(color.substring(1), 16);
    }

    // Handles the About dialog
    function addAbout() {
        let about = MenuBar.menus.help.structure.find(e => e.id === "about_plugins")
        
        if (!about) {
            about = new Action("about_plugins", {
                name: "About Plugins...",
                icon: "info",
                children: []
            })
            MenuBar.addAction(about, "help")
        }

        aboutAction = new Action(`about_${id}`, {
            name: `About ${name}...`,
            icon,
            click: () => showAbout()
        })

        about.children.push(aboutAction)
    }

    function showAbout(banner) {
        const infoBox = new Dialog({
            id: "about",
            title: name,
            width: 780,
            buttons: [],
            lines: [`
                <style>
                    dialog#about .dialog_title {
                        padding-left: 0;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }

                    dialog#about .dialog_content {
                        text-align: left!important;
                        margin: 0!important;
                    }

                    dialog#about .socials {
                        padding: 0!important;
                    }
                    
                    dialog#about #banner {
                        background-color: var(--color-accent);
                        color: var(--color-accent_text);
                        width: 100%;
                        padding: 0 8px
                    }

                    dialog#about #content {
                        margin: 24px;
                    }
                </style>

                ${banner ? `<div id="banner">This window can be reopened at any time from <strong>Help > About Plugins > ${name}</strong></div>` : ""}
                <div id="content">
                    <h1 style="margin-top:-10px">${name}</h1>
                    <p>placeholder</p>
                    <div class="socials">
                        <a href="${links["website"]}" class="open-in-browser">
                            <i class="icon material-icons" style="color:#33E38E">language</i>
                            <label>More By SirJain</label>
                        </a>
                        <a href="${links["twitter"]}" class="open-in-browser">
                            <i class="fa-brands fa-twitter" style="color:#1DA1F2"></i>
                            <label>Twitter</label>
                        </a>
                        <a href="${links["discord"]}" class="open-in-browser">
                            <i class="icon fab fa-discord" style="color:#727FFF"></i>
                            <label>Discord Server</label>
                        </a>
                    </div>
                </div>
            `]
        }).show()
        $("dialog#about .dialog_title").html(`
            <i class="icon material-icons">${icon}</i>
            ${name}
        `)
    }
})()