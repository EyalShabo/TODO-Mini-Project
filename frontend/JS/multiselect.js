document.querySelectorAll(".multiselect").forEach(multiselect => {
    const selectedBox = multiselect.querySelector(".multiselect-selected-options");
    const dropdown = multiselect.querySelector(".multiselect-options-dropdown");
    const selectedSpan = multiselect.querySelector(".multiselect-selected");
    const searchInput = multiselect.querySelector(".multiselect-search");

    selectedBox.addEventListener("click", () => {
        dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
    });

    function updateSelected() {
        const selected = Array.from(multiselect.querySelectorAll('input[type="checkbox"]'))
            .filter(cb => cb.checked)
            .map(cb => cb.closest("label").textContent);
        selectedSpan.textContent = selected.length ? selected.join(", ") : "All";
    }

    dropdown.addEventListener("change", function(event){
        if(event.target.type === "checkbox")
            updateSelected();
    })

    searchInput.addEventListener("input", function () {
        const filter = this.value.toLowerCase();
        multiselect.querySelectorAll(".multiselect-option").forEach(option => {
            const label = option.textContent.toLowerCase();
            option.style.display = label.includes(filter) ? "" : "none";
        });
    });
});

document.addEventListener("click", function(event) {
    document.querySelectorAll(".multiselect").forEach(multiselect => {
        if (!multiselect.contains(event.target)) {
            const dropdown = multiselect.querySelector(".multiselect-options-dropdown");
            dropdown.style.display = "none";
        }
    });
});
