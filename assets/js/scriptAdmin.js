
// ======================================
// ADEGA DE MOC - ADMINISTRAÇÃO
// Cadastro, edição, imagens e exclusão
// ======================================

const formCadastro = document.getElementById("formCadastro");
const listaProdutos = document.getElementById("itens");

const campoImagem = document.getElementById("imagemProduto");
const previewImagem = document.getElementById("previewImagem");
const textoPreview = document.getElementById("textoPreview");

let isEditando = null;
let imagemSelecionada = null;

// ======================================
// LOCAL STORAGE
// ======================================

function obterProdutos() {
    try {
        return JSON.parse(localStorage.getItem("Produtos")) || [];
    } catch {
        return [];
    }
}

function salvarProdutos(produtos) {
    localStorage.setItem("Produtos", JSON.stringify(produtos));
}

// ======================================
// COMPRIMIR IMAGEM
// ======================================

function comprimirImagem(arquivo) {

    return new Promise((resolve, reject) => {

        if (!arquivo.type.startsWith("image/")) {
            reject(new Error("Selecione um arquivo de imagem."));
            return;
        }

        if (arquivo.size > 8 * 1024 * 1024) {
            reject(new Error("A imagem deve ter no máximo 8 MB."));
            return;
        }

        const leitor = new FileReader();

        leitor.onload = () => {

            const imagem = new Image();

            imagem.onload = () => {

                const tamanhoMaximo = 800;

                let largura = imagem.width;
                let altura = imagem.height;

                if (largura > tamanhoMaximo || altura > tamanhoMaximo) {

                    const proporcao = Math.min(
                        tamanhoMaximo / largura,
                        tamanhoMaximo / altura
                    );

                    largura = Math.round(largura * proporcao);
                    altura = Math.round(altura * proporcao);
                }

                const canvas = document.createElement("canvas");

                canvas.width = largura;
                canvas.height = altura;

                const contexto = canvas.getContext("2d");

                contexto.fillStyle = "#ffffff";
                contexto.fillRect(0, 0, largura, altura);

                contexto.drawImage(
                    imagem,
                    0,
                    0,
                    largura,
                    altura
                );

                const imagemFinal = canvas.toDataURL(
                    "image/jpeg",
                    0.75
                );

                resolve(imagemFinal);
            };

            imagem.onerror = () => {
                reject(new Error("Não foi possível carregar a imagem."));
            };

            imagem.src = leitor.result;
        };

        leitor.onerror = () => {
            reject(new Error("Erro ao ler o arquivo."));
        };

        leitor.readAsDataURL(arquivo);
    });
}

// ======================================
// PRÉ-VISUALIZAÇÃO
// ======================================

campoImagem.addEventListener("change", async () => {

    const arquivo = campoImagem.files[0];

    if (!arquivo) return;

    try {

        imagemSelecionada = await comprimirImagem(arquivo);

        previewImagem.src = imagemSelecionada;
        previewImagem.style.display = "block";

        textoPreview.style.display = "none";

    } catch (erro) {

        alert(erro.message);

        campoImagem.value = "";
        imagemSelecionada = null;
    }
});

// ======================================
// LIMPAR FORMULÁRIO
// ======================================

formCadastro.addEventListener("reset", () => {

    isEditando = null;
    imagemSelecionada = null;

    campoImagem.value = "";

    previewImagem.src = "";
    previewImagem.style.display = "none";

    textoPreview.style.display = "block";
});

// ======================================
// CADASTRAR E EDITAR
// ======================================

formCadastro.addEventListener("submit", async (event) => {

    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();

    const preco = Number(
        document.getElementById("preco").value
            .replace(",", ".")
            .replace(/[^\d.]/g, "")
    );

    const categoria = document.getElementById("categoria").value.trim();

    if (
        !nome ||
        !categoria ||
        !Number.isFinite(preco) ||
        preco <= 0
    ) {
        alert("Preencha todos os campos corretamente!");
        return;
    }

    const produtos = obterProdutos();

    const produtoAnterior = isEditando !== null
        ? produtos[isEditando]
        : null;

    // Preservar imagem anterior quando não houver nova seleção
    let imagem = produtoAnterior?.imagem || "";

    // Converter nova imagem, caso tenha sido selecionada
    if (campoImagem.files.length > 0) {

        try {

            imagem = imagemSelecionada ||
                await comprimirImagem(campoImagem.files[0]);

        } catch (erro) {

            alert(erro.message);
            return;
        }
    }

    const produto = {
        nome,
        preco,
        categoria,
        imagem
    };

    if (isEditando !== null) {

        produtos[isEditando] = produto;

    } else {

        produtos.push(produto);
    }

    try {

        salvarProdutos(produtos);

        alert("Produto salvo com sucesso!");

        formCadastro.reset();

        carregarProdutos();

    } catch (erro) {

        alert(
            "Não foi possível salvar o produto. " +
            "O armazenamento pode estar cheio. " +
            "Tente utilizar uma imagem menor."
        );
    }
});

// ======================================
// CARREGAR TABELA
// ======================================

function carregarProdutos() {

    const produtos = obterProdutos();

    listaProdutos.innerHTML = "";

    if (produtos.length === 0) {

        listaProdutos.innerHTML = `
            <tr>
                <td colspan="5">
                    Nenhum produto cadastrado.
                </td>
            </tr>
        `;

        return;
    }

    produtos.forEach((produto, index) => {

        const linha = document.createElement("tr");

        // Foto
        const colunaImagem = document.createElement("td");

        if (produto.imagem) {

            const foto = document.createElement("img");

            foto.src = produto.imagem;
            foto.alt = produto.nome;
            foto.className = "foto-produto-admin";

            colunaImagem.appendChild(foto);

        } else {

            colunaImagem.textContent = "Sem foto";
        }

        // Nome
        const colunaNome = document.createElement("td");
        colunaNome.textContent = produto.nome;

        // Preço
        const colunaPreco = document.createElement("td");

        colunaPreco.textContent = Number(produto.preco).toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );

        // Categoria
        const colunaCategoria = document.createElement("td");
        colunaCategoria.textContent = produto.categoria;

        // Ações
        const colunaAcoes = document.createElement("td");

        const botaoEditar = document.createElement("button");

        botaoEditar.textContent = "Editar";
        botaoEditar.type = "button";
        botaoEditar.className = "btn-editar";

        botaoEditar.onclick = () => editarProduto(index);

        const botaoExcluir = document.createElement("button");

        botaoExcluir.textContent = "Excluir";
        botaoExcluir.type = "button";
        botaoExcluir.className = "btn-excluir";

        botaoExcluir.onclick = () => excluirProduto(index);

        colunaAcoes.appendChild(botaoEditar);
        colunaAcoes.appendChild(botaoExcluir);

        linha.appendChild(colunaImagem);
        linha.appendChild(colunaNome);
        linha.appendChild(colunaPreco);
        linha.appendChild(colunaCategoria);
        linha.appendChild(colunaAcoes);

        listaProdutos.appendChild(linha);
    });
}

// ======================================
// EDITAR PRODUTO
// ======================================

function editarProduto(index) {

    const produtos = obterProdutos();

    const produto = produtos[index];

    if (!produto) return;

    document.getElementById("nome").value = produto.nome;
    document.getElementById("preco").value = produto.preco;
    document.getElementById("categoria").value = produto.categoria;

    isEditando = index;
    imagemSelecionada = null;

    campoImagem.value = "";

    if (produto.imagem) {

        previewImagem.src = produto.imagem;
        previewImagem.style.display = "block";

        textoPreview.style.display = "none";

    } else {

        previewImagem.style.display = "none";
        textoPreview.style.display = "block";
    }

    formCadastro.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}

// ======================================
// EXCLUIR PRODUTO
// ======================================

function excluirProduto(index) {

    if (!confirm("Tem certeza que deseja excluir este produto?")) {
        return;
    }

    const produtos = obterProdutos();

    produtos.splice(index, 1);

    salvarProdutos(produtos);

    if (isEditando === index) {

        formCadastro.reset();

    } else if (isEditando !== null && isEditando > index) {

        isEditando--;
    }

    carregarProdutos();
}

// ======================================
// INICIALIZAR
// ======================================

carregarProdutos();
