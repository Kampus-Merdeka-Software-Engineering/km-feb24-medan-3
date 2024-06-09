// sidebar func
const body = document.querySelector("body"),
            sidebar = body.querySelector("nav"),
            toggle = body.querySelector(".toggle"),
            modeSwitch = body.querySelector(".toggle-switch"),
            modeText = body.querySelector(".mode-text");

        if (localStorage.getItem("dark-mode") === "enabled") {
            body.classList.add("dark");
            modeText.innerText = "Light mode";
        }

        toggle.addEventListener("click", () => {
            sidebar.classList.toggle("close");
        });

        modeSwitch.addEventListener("click", () => {
            body.classList.toggle("dark");

            if (body.classList.contains("dark")) {
                localStorage.setItem("dark-mode", "enabled");
                modeText.innerText = "Light mode";
            } else {
                localStorage.setItem("dark-mode", "disabled");
                modeText.innerText = "Dark mode";
            }
        });