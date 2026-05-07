document.addEventListener("DOMContentLoaded", () => {
const form = document.getElementById("registration-form");

form.addEventListener("submit", (e) => {
    const senha = document.getElementById("password").value.trim();
    const confirmarSenha = document.getElementById("confirm-password").value.trim();
    const cpf = document.getElementById("cpf").value.replace(/\D/g, "");
    
    if (nome !=="" || cpf !== "" || email !== "" || telefone !=="" || endereco !== "" || senha !== "" || confirmarSenha !== ""){
        e.preventDefault();
        alert("Por favor, preencha todos os campos!");
        return;
        }
    
    if (cpf.replace(/\D/g, "").length !== 11) {
        e.preventDefault();
        alert("CPF inválido! Digite apenas números ou no formato 000.000.000-00");
        return;
    }
    
    if (senha.length < 8){
        e.preventDefault();
        alert("A senha deve ter no mínimo 8 caracteres!");
        return;
    }

    if (senha !== confirmarSenha) {
        e.preventDefault();
        alert("As senhas não coincidem!");
        return;
    }


    window.location.href = "login.html";
    alert("Cadastro realizado com sucesso!");
});
});