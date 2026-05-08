// db.js
const dadosIniciais = [
    { id: 1, titulo: "Escavadeira Hidráulica X3", categoria: "Escavadeiras", preco: 250, local: "Maceió, AL", imagem: "https://placehold.co/300x200", donoCPF: "00000000000", descricao: "Escavadeira em ótimo estado." },
    { id: 2, titulo: "Operador de Retroescavadeira", categoria: "Operadores", preco: 150, local: "Arapiraca, AL", imagem: "https://placehold.co/300x200", donoCPF: "11111111111", descricao: "10 anos de experiência." }
];

if (!localStorage.getItem('bancoDeDados')) {
    localStorage.setItem('bancoDeDados', JSON.stringify(dadosIniciais));
}

const DB = {
    buscarTodos: () => JSON.parse(localStorage.getItem('bancoDeDados')),
    
    salvarAnuncio: (novoAnuncio) => {
        const atual = DB.buscarTodos();
        atual.push(novoAnuncio);
        localStorage.setItem('bancoDeDados', JSON.stringify(atual));
    },

    removerAnuncio: (id) => {
        const atual = DB.buscarTodos();
        const filtrado = atual.filter(anuncio => anuncio.id !== id);
        localStorage.setItem('bancoDeDados', JSON.stringify(filtrado));
    },

    getUsuario: (cpf) => JSON.parse(localStorage.getItem(cpf)),

    getUsuarioLogado: () => {
        const cpf = localStorage.getItem('loggedInUserCPF');
        return cpf ? DB.getUsuario(cpf) : null;
    },

    logout: () => {
        localStorage.removeItem('loggedInUserCPF');
        window.location.replace('login.html');
    }
};