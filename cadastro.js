document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registration-form");

    form.addEventListener("submit", function(event) {
        // 1. Impede que a página recarregue ao clicar em "Cadastrar"
        event.preventDefault(); 

        // 2. Captura os valores digitados nos campos
        const name = document.getElementById("name").value;
        const cpf = document.getElementById("cpf").value;
        const email = document.getElementById("email").value;
        const telefone = document.getElementById("telefone").value;
        const endereco = document.getElementById("endereco").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm-password").value;
        const operated = document.getElementById("operated").value;
        const photoInput = document.getElementById("photo");

        function validaSenha(senha) {

    if (senha.length < 8) return false;

    if (!/[a-z]/.test(senha)) return false;

    if (!/[A-Z]/.test(senha)) return false;

    if (!/[0-9]/.test(senha)) return false;

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha)) return false;

    return true;

}function validaEmail(email) {

    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return regex.test(email);

}function validaCPF(cpf) {

    cpf = cpf.replace(/[^\d]+/g, '');

    if (cpf.length !== 11) return false;

    if (/^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;

    let resto;

    for (let i = 1; i <= 9; i++) {

        soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);

    }

    resto = (soma * 10) % 11;

    if ((resto == 10) || (resto == 11)) resto = 0;

    if (resto != parseInt(cpf.substring(9, 10))) return false;

    soma = 0;

    for (let i = 1; i <= 10; i++) {

        soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);

    }

    resto = (soma * 10) % 11;

    if ((resto == 10
        
        // 3. Validação simples: verifica se as senhas batem
        if (password !== confirmPassword) {
            alert("As senhas não coincidem. Por favor, tente novamente.");
            return; // Para a execução do código aqui
        }

        // Função interna para montar os dados, salvar e mudar de tela
        const salvarERedirecionar = (fotoEmBase64) => {
            
            // Cria um "objeto" com todos os dados do usuário
            const novoUsuario = {
                nome: name,
                cpf: cpf,
                email: email,
                telefone: telefone,
                endereco: endereco,
                senha: password, // NOTA: Em sistemas reais, nunca salvamos a senha aberta assim! Mas para o protótipo, tudo bem.
                operador: operated,
                foto: fotoEmBase64
            };

            // Puxa a lista de usuários que já existe no navegador (se não existir, cria uma lista vazia [])
            let usuariosCadastrados = JSON.parse(localStorage.getItem("usuariosMaquinaria")) || [];
            
            // Verifica se já existe alguém com esse e-mail
            const emailJaExiste = usuariosCadastrados.find(user => user.email === email);
            if (emailJaExiste) {
                alert("Este e-mail já está cadastrado! Tente fazer login.");
                return;
            }

            // Adiciona o novo usuário na lista e salva de volta no navegador
            usuariosCadastrados.push(novoUsuario);
            localStorage.setItem("usuariosMaquinaria", JSON.stringify(usuariosCadastrados));

            // Avisa que deu certo e redireciona
            alert("Cadastro realizado com sucesso! Levando você para o login...");
            
            // Redireciona para a página de login (certifique-se de que o arquivo se chama exatamente login.html)
            window.location.href = "login.html"; 
        };

        // 4. Lógica para salvar a imagem (se o usuário tiver escolhido uma)
        if (photoInput.files && photoInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                // Se leu a imagem com sucesso, chama a função passando a imagem
                salvarERedirecionar(e.target.result); 
            };
            reader.readAsDataURL(photoInput.files[0]);
        } else {
            // Se não enviou foto, chama a função passando vazio
            salvarERedirecionar(""); 
        }
    });
});