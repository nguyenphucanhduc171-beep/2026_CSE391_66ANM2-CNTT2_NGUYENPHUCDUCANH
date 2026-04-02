const modal = document.getElementById("modal");
const btnAdd = document.getElementById("btnAdd");
const btnCancel = document.getElementById("btnCancel");
const form = document.getElementById("studentForm");

const studentId = document.getElementById("studentId");
const fullName = document.getElementById("fullName");
const dob = document.getElementById("dob");
const gpa = document.getElementById("gpa");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

const editIndex = document.getElementById("editIndex");

const studentTable = document.getElementById("studentTable");
const total = document.getElementById("total");
const avg = document.getElementById("avg");


// OPEN MODAL
btnAdd.onclick = () => {
    modal.style.display = "flex";
    form.reset();
    editIndex.value = "";
    clearErrors();
}

// CLOSE
btnCancel.onclick = () => {
    modal.style.display = "none";
}


// LOCAL STORAGE
function getStudents() {
    return JSON.parse(localStorage.getItem("students")) || [];
}

function saveStudents(data) {
    localStorage.setItem("students", JSON.stringify(data));
}


// ERROR
function setError(id, msg) {
    document.getElementById(id).innerText = msg;
}

function clearErrors() {
    document.querySelectorAll(".error")
        .forEach(e => e.innerText = "");

    document.querySelectorAll("input,select")
        .forEach(e => e.classList.remove("input-error"));
}


// VALIDATE
function validate(data) {

    clearErrors();
    let ok = true;


    // ID
    if (data.id === "") {
        setError("errId", "Không được để trống");
        ok = false;
    }
    else if (!/^SV\d{6}$/.test(data.id)) {
        setError("errId", "Phải dạng SV123456");
        ok = false;
    }


    // NAME
    if (data.name === "") {
        setError("errName", "Không được để trống");
        ok = false;
    }
    else if (!/^[A-Za-zÀ-ỹ\s]+$/.test(data.name)) {
        setError("errName", "Chỉ chữ cái");
        ok = false;
    }


    // DOB
    if (data.dob === "") {
        setError("errDob", "Không được để trống");
        ok = false;
    }
    else {
        let birth = new Date(data.dob);
        let today = new Date();

        let age = today.getFullYear() - birth.getFullYear();
        let m = today.getMonth() - birth.getMonth();

        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }

        if (age < 18) {
            setError("errDob", "Phải >= 18 tuổi");
            ok = false;
        }
    }


    // CLASS
    if (data.class === "") {
        setError("errClass", "Chọn lớp");
        ok = false;
    }


    // GPA
    if (!/^(10(\.00?)?|[0-9](\.[0-9]{1,2})?)$/.test(data.gpa)) {
        setError("errGpa", "0-10 (2 số thập phân)");
        ok = false;
    }


    // EMAIL
    if (!/^[A-Za-z0-9._%+-]+@student\.edu\.vn$/.test(data.email)) {
        setError("errEmail", "Email @student.edu.vn");
        ok = false;
    }


    // PASS
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(data.password)) {
        setError("errPass", "Password không hợp lệ");
        ok = false;
    }


    // CONFIRM
    if (data.confirm !== data.password) {
        setError("errConfirm", "Không khớp mật khẩu");
        ok = false;
    }

    return ok;
}


// SUBMIT
form.onsubmit = function (e) {

    e.preventDefault();

    let data = {
        id: studentId.value,
        name: fullName.value,
        dob: dob.value,
        class: document.getElementById("class").value,
        gpa: gpa.value,
        email: email.value,
        password: password.value,
        confirm: confirmPassword.value
    };

    if (!validate(data)) return;

    let students = getStudents();

    let index = editIndex.value;

    if (index === "") {
        students.push(data);
    } else {
        students[index] = data;
    }

    saveStudents(students);

    modal.style.display = "none";

    render();

}


// RENDER
function render() {

    let data = getStudents();

    let html = "";

    data.forEach((s, i) => {

        html += `
<tr>
<td>${i + 1}</td>
<td>${s.id}</td>
<td>${s.name}</td>
<td>${s.dob}</td>
<td>${s.class}</td>
<td>${s.gpa}</td>
<td>
<button class="btn-edit" onclick="edit(${i})">Sửa</button>
<button class="btn-delete" onclick="removeStudent(${i})">Xoá</button>
</td>
</tr>
`;

    });

    studentTable.innerHTML = html;

    total.innerText = data.length;

    let sum = 0;
    data.forEach(s => sum += parseFloat(s.gpa));

    avg.innerText = data.length ? (sum / data.length).toFixed(2) : 0;

}


// EDIT
function edit(i) {

    let s = getStudents()[i];

    editIndex.value = i;

    studentId.value = s.id;
    fullName.value = s.name;
    dob.value = s.dob;
    document.getElementById("class").value = s.class;
    gpa.value = s.gpa;
    email.value = s.email;
    password.value = s.password;
    confirmPassword.value = s.password;

    modal.style.display = "flex";

}


// DELETE
function removeStudent(i) {

    if (confirm("Bạn chắc xoá?")) {

        let data = getStudents();

        data.splice(i, 1);

        saveStudents(data);

        render();

    }

}

render();