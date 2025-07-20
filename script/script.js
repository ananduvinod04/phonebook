let getContacts = async () => {
  let response = await fetch("http://localhost:3000/contacts");
  let data = await response.json();
  data.forEach((element) => {
    let contactList = document.getElementById("contactlist");
    let contactListItem = document.createElement("li");
    contactListItem.classList.add("bg-dark", "text-white");
    contactListItem.setAttribute("data-bs-toggle", "modal");
    contactListItem.setAttribute("data-bs-target", "#contactDisplayModal");
    let nameDiv = document.createElement("div");
    nameDiv.innerHTML = element.name;
    nameDiv.classList.add("contactName");
    contactListItem.appendChild(nameDiv);
    let mobileNumber = document.createElement("div");
    mobileNumber.innerHTML = element.phone;
    mobileNumber.classList.add("contactNumber");
    contactListItem.appendChild(mobileNumber);
    contactListItem.classList.add("list-group-item");
    contactList.appendChild(contactListItem);

    contactListItem.addEventListener("click", () => {
      document.getElementById("modalContactName").textContent = element.name;
      document.getElementById("modalContactPhone").textContent = element.phone;
      document.getElementById("modalContactEmail").textContent = element.email;
      document.getElementById("modalContactAddress").textContent =
        element.address;
      document.getElementById("deleteBtn").setAttribute("data-id", element.id); //for delebtn btn in contact info modal
    });
  });
};

getContacts();

let newContactForm = document.getElementById("newContactForm");

newContactForm.addEventListener("submit", async function addContact() {
  let newContactName = document.getElementById("NewContactName").value.trim();
  let NewContactNumber = document
    .getElementById("NewContactNumber")
    .value.trim();
  let NewContactEmail = document.getElementById("NewContactEmail").value.trim();
  let NewContactAddress = document
    .getElementById("NewContactAddress")
    .value.trim();

  const nameRegex = /^[A-Za-z\s]{3,}$/;
  const phoneRegex = /^\d{10}$/;

  const addressMinLength = 5;

  if (!nameRegex.test(newContactName)) {
    alert("❌ Please enter a valid name (at least 3 letters, no numbers).");
    return;
  }
  if (!phoneRegex.test(NewContactNumber)) {
    alert("❌ Please enter a valid 10-digit phone number.");
    return;
  }
  if (NewContactAddress.length < addressMinLength) {
    alert("❌ Address must be at least 5 characters long.");
    return;
  }

  const newContact = {
    name: newContactName,
    phone: NewContactNumber,
    email: NewContactEmail,
    address: NewContactAddress,
  };
  try {
    const response = await fetch("http://localhost:3000/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newContact),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ New contact added:", data);
  } catch (error) {
    console.error("❌ Error posting contact:", error);
  }
});
function clearNewContactField() {
  document.getElementById("NewContactName").value = "";
  document.getElementById("NewContactNumber").value = "";
  document.getElementById("NewContactEmail").value = "";
  document.getElementById("NewContactAddress").value = "";
}

let deleteBtn = document.getElementById("deleteBtn");
deleteBtn.addEventListener("click", async () => {
  const contactId = deleteBtn.getAttribute("data-id");
  if (!contactId) return;

  try {
    const deleteResponse = await fetch(
      `http://localhost:3000/contacts/${contactId}`,
      {
        method: "DELETE",
      }
    );
    if (!deleteResponse.ok) throw new Error("Delete failed");

    console.log(`🗑️ Contact deleted`);
    getContacts(); // Refresh the list
    const modalEl = document.getElementById("contactDisplayModal");
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    modalInstance.hide(); // Close modal
  } catch (error) {
    console.error("❌ Error deleting contact:", error);
  }
});
