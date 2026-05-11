       // ==========================================
        // LÓGICA DE MENSAGENS
        // ==========================================
        let contatoAtual = ''; 
        
        const conversasDb = {
            'Carlos Lisboa (Operador)': [
                { tipo: 'recebida', texto: 'Olá João, o caminhão ainda está disponível para amanhã?', tempo: 'Hoje, 09:00' }
            ],
            'Maria Construtora': [
                { tipo: 'recebida', texto: 'Gostaria de fechar o guindaste para o fim de semana.', tempo: 'Ontem, 15:30' }
            ]
        };

        function abrirChat(nomeDoContato) {
            contatoAtual = nomeDoContato;

            document.getElementById('listaMensagens').classList.add('d-none');
            document.getElementById('areaChat').classList.remove('d-none');
            document.getElementById('nomeContatoChat').innerText = nomeDoContato;
            document.getElementById('inputChat').value = '';

            const historico = document.getElementById('historicoChat');
            historico.innerHTML = ''; 

            if (!conversasDb[nomeDoContato]) {
                conversasDb[nomeDoContato] = [];
            }

            conversasDb[nomeDoContato].forEach(msg => {
                let msgHTML = '';
                if (msg.tipo === 'recebida') {
                    msgHTML = `
                        <div class="d-flex mb-3">
                            <div class="msg-bubble msg-received shadow-sm">
                                <p class="mb-1">${msg.texto}</p>
                                <small class="text-muted" style="font-size: 0.7rem;">${msg.tempo}</small>
                            </div>
                        </div>
                    `;
                } else {
                    msgHTML = `
                        <div class="d-flex justify-content-end mb-3">
                            <div class="msg-bubble msg-sent shadow-sm">
                                <p class="mb-1">${msg.texto}</p>
                                <small class="text-white-50" style="font-size: 0.7rem;">${msg.tempo}</small>
                            </div>
                        </div>
                    `;
                }
                historico.insertAdjacentHTML('beforeend', msgHTML);
            });

            historico.scrollTop = historico.scrollHeight; 
        }

        function voltarParaLista() {
            document.getElementById('areaChat').classList.add('d-none');
            document.getElementById('listaMensagens').classList.remove('d-none');
            contatoAtual = ''; 
        }

        function enviarMensagemChat(event) {
            event.preventDefault(); 
            
            const input = document.getElementById('inputChat');
            const textoMensagem = input.value;
            
            if(textoMensagem.trim() === '') return; 

            conversasDb[contatoAtual].push({
                tipo: 'enviada',
                texto: textoMensagem,
                tempo: 'Agora'
            });

            const novaMensagemHTML = `
                <div class="d-flex justify-content-end mb-3">
                    <div class="msg-bubble msg-sent shadow-sm">
                        <p class="mb-1">${textoMensagem}</p>
                        <small class="text-white-50" style="font-size: 0.7rem;">Agora</small>
                    </div>
                </div>
            `;
            
            const historico = document.getElementById('historicoChat');
            historico.insertAdjacentHTML('beforeend', novaMensagemHTML);
            historico.scrollTop = historico.scrollHeight;
            input.value = '';
        }

        // ==========================================
        // OUTRAS FUNÇÕES DO PAINEL
        // ==========================================
        function previewFoto(input) {
            if (input.files && input.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('perfilFoto').src = e.target.result;
                }
                reader.readAsDataURL(input.files[0]);
            }
        }

        function atualizarCategorias(targetId, tipo) {
            const select = document.getElementById(targetId);
            if (!select) return;

            const catsMaquina = ['Escavadeiras', 'Guindastes', 'Caminhões', 'Compactadores'];
            const catsOperador = ['Op. de Escavadeira', 'Op. de Guindaste', 'Motorista de Caminhão'];
            
            const lista = (tipo === 'maquina') ? catsMaquina : catsOperador;
            select.innerHTML = lista.map(c => `<option value="${c}">${c}</option>`).join('');
        }

        function publicarServico(event) {
            event.preventDefault(); 

            const titulo = document.getElementById('novoTitulo').value;
            const precoRaw = document.getElementById('novoPreco').value;
            const preco = parseFloat(precoRaw).toFixed(2).replace('.', ',');
            const categoria = document.getElementById('catNovo').value;
            const tipo = document.getElementById('tipoServico').value;
            const subtitulo = tipo === 'maquina' ? `Máquinas > ${categoria}` : `Operador > ${categoria}`;
            const inputArquivo = document.getElementById('novoArquivo');
            
            let imgSrc = tipo === 'maquina' ? 'https://via.placeholder.com/70x50?text=Maq' : 'https://via.placeholder.com/70x50?text=Op';

            const criarLinhaTabela = (imagemParaUsar) => {
                const novaLinhaHTML = `
                    <tr>
                        <td>
                            <div class="d-flex align-items-center">
                                <img src="${imagemParaUsar}" class="service-img-mini img-servico me-3">
                                <div>
                                    <div class="fw-bold titulo-servico">${titulo}</div>
                                    <small class="text-muted subtitulo-servico">${subtitulo}</small>
                                </div>
                            </div>
                        </td>
                        <td><span class="badge bg-success-subtle text-success">Ativo</span></td>
                        <td class="preco-servico">R$ ${preco}</td>
                        <td class="text-end">
                            <button class="btn btn-sm btn-outline-primary me-1" onclick="abrirEdicao(this)"><i class="bi bi-pencil"></i></button>
                            <button class="btn btn-sm btn-outline-danger" onclick="excluirServico(this)"><i class="bi bi-trash"></i></button>
                        </td>
                    </tr>
                `;

                document.getElementById('tabelaMeusServicos').insertAdjacentHTML('afterbegin', novaLinhaHTML);

                alert("Parabéns! Seu serviço foi publicado com sucesso.");
                document.getElementById('formNovoServico').reset();
                atualizarCategorias('catNovo', 'maquina');
                const tab = new bootstrap.Tab(document.querySelector('#tab-meus-servicos'));
                tab.show();
            };

            if (inputArquivo.files && inputArquivo.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    criarLinhaTabela(e.target.result);
                }
                reader.readAsDataURL(inputArquivo.files[0]);
            } else {
                criarLinhaTabela(imgSrc);
            }
        }
        
        let linhaSendoEditada = null; 
        let modalEdicaoInstancia = null; 

        function excluirServico(botaoClicado) {
            if (confirm("Tem certeza que deseja excluir este anúncio? Esta ação não pode ser desfeita.")) {
                botaoClicado.closest('tr').remove();
            }
        }

        function abrirEdicao(botaoClicado) {
            linhaSendoEditada = botaoClicado.closest('tr');
            const tituloAtual = linhaSendoEditada.querySelector('.titulo-servico').innerText;
            const precoTexto = linhaSendoEditada.querySelector('.preco-servico').innerText; 
            const precoNum = precoTexto.replace('R$', '').trim().replace(',', '.');

            document.getElementById('editTitulo').value = tituloAtual;
            document.getElementById('editPreco').value = precoNum;
            document.getElementById('editArquivo').value = ""; 

            if(!modalEdicaoInstancia) {
                modalEdicaoInstancia = new bootstrap.Modal(document.getElementById('modalEditarServico'));
            }
            modalEdicaoInstancia.show();
        }

        function salvarEdicao() {
            if (!linhaSendoEditada) return;

            const novoTitulo = document.getElementById('editTitulo').value;
            const novoPrecoRaw = document.getElementById('editPreco').value;
            const novoPrecoFormatado = parseFloat(novoPrecoRaw).toFixed(2).replace('.', ',');
            const inputFotoEdit = document.getElementById('editArquivo');

            linhaSendoEditada.querySelector('.titulo-servico').innerText = novoTitulo;
            linhaSendoEditada.querySelector('.preco-servico').innerText = `R$ ${novoPrecoFormatado}`;

            const finalizar = () => {
                modalEdicaoInstancia.hide();
                alert("Anúncio atualizado com sucesso!");
            };

            if (inputFotoEdit.files && inputFotoEdit.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    linhaSendoEditada.querySelector('.img-servico').src = e.target.result;
                    finalizar();
                }
                reader.readAsDataURL(inputFotoEdit.files[0]);
            } else {
                finalizar();
            }
        }

        // ==========================================
        // FUNÇÕES DA ABA PERFIL (ADICIONAR/REMOVER)
        // ==========================================

function carregarDadosPerfil() {
    const usuario = DB.getUsuarioLogado();

    if (usuario) {
        // 1. Dados Básicos

        const spanNomeTopo = document.getElementById('user-display-name');
        if (spanNomeTopo && usuario.nome) {
            const primeiroNome = usuario.nome.split(' ')[0]; 
            spanNomeTopo.innerText = primeiroNome;
        }

        if (document.getElementById('perfilNome')) document.getElementById('perfilNome').value = usuario.nome || '';
        if (document.getElementById('perfilEmail')) document.getElementById('perfilEmail').value = usuario.email || '';
        if (document.getElementById('perfilCPF')) document.getElementById('perfilCPF').value = usuario.cpf || '';
        if (document.getElementById('perfilTipo')) document.getElementById('perfilTipo').value = usuario.tipo || 'nao';

    
        const campoFoto = document.getElementById('perfilFoto');
        if (campoFoto && usuario.foto) {
            campoFoto.src = usuario.foto;
        }

        // 3. Telefone (Usando o ID exato que você pediu: perilTelefone)
        const campoTelefone = document.getElementById('perfilTelefone');
        if (campoTelefone) {
            // Se for uma lista de telefones, pega o primeiro. Se for texto simples, usa direto.
            campoTelefone.value = Array.isArray(usuario.telefones) ? usuario.telefones[0] : (usuario.telefone || '');
        }

        // 4. Endereço (Usando o ID exato: perfilEndereco)
        const campoEndereco = document.getElementById('perfilEndereco');
        if (campoEndereco) {
            // Se for uma lista de endereços, pega o primeiro. Se for texto simples, usa direto.
            campoEndereco.value = Array.isArray(usuario.enderecos) ? usuario.enderecos[0] : (usuario.endereco || '');
        }
    }
}

// Garante que os dados serão carregados assim que a página abrir
document.addEventListener('DOMContentLoaded', carregarDadosPerfil);



        function adicionarCampo(containerId, tipo) {
            const container = document.getElementById(containerId);
            const placeholder = tipo === 'tel' ? '(00) 00000-0000' : 'Endereço completo';
            
            const novoCampo = `
                <div class="dynamic-field">
                    <input type="text" class="form-control" placeholder="${placeholder}">
                    <button type="button" class="btn btn-outline-danger border-0" onclick="removerCampo(this)">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', novoCampo);
        }

        function removerCampo(botao) {
            // Sobe pela estrutura do DOM até achar o container pai que engloba os campos
            const container = botao.closest('#containerTelefones, #containerEnderecos');
            
            // Só permite remover se houver mais de 1 campo no container
            if (container && container.children.length > 1) {
                botao.closest('.dynamic-field').remove();
            } else {
                alert("Você precisa manter pelo menos um registro.");
            }
        }

        function salvarPerfil() {
            const nome = document.getElementById('perfilNome').value;
            // Atualiza o nome de saudação no topo da página
            if (document.getElementById('nomeSaudacaoTop')) {
                document.getElementById('nomeSaudacaoTop').innerText = nome;
            }
            alert('Perfil atualizado com sucesso!');
        }

        document.addEventListener('DOMContentLoaded', () => {
            atualizarCategorias('catNovo', 'maquina');
        });