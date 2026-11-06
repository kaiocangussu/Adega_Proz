
// ======================================
// ADEGA DE MOC - LOJA
// Catálogo de produtos com imagens
// ======================================

const listaProdutos = document.getElementById("lista-produtos");

const pesquisaProduto = document.getElementById("pesquisaProduto");

let categoriaSelecionada = "Todos";

// ======================================
// RECUPERAR PRODUTOS
// ======================================

function obterProdutos() {

    try {
        return JSON.parse(localStorage.getItem("Produtos")) || [];
    } catch {
        return [];
    }
}

// ======================================
// FORMATAR PREÇO
// ======================================

function formatarPreco(preco) {

    return Number(preco).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// ======================================
// EXIBIR PRODUTOS
// ======================================

function carregarProdutos() {

    const produtos = obterProdutos();

    const pesquisa = pesquisaProduto.value
        .trim()
        .toLowerCase();

    const produtosFiltrados = produtos.filter(produto => {

        const nome = (produto.nome || "").toLowerCase();
        const categoria = (produto.categoria || "").toLowerCase();

        const correspondePesquisa =
            nome.includes(pesquisa) ||
            categoria.includes(pesquisa);

        const correspondeCategoria =
            categoriaSelecionada === "Todos" ||
            categoria === categoriaSelecionada.toLowerCase() ||
            (
                categoriaSelecionada === "Outras bebidas" &&
                !["vinhos", "cervejas", "destilados"].includes(categoria)
            );

        return correspondePesquisa && correspondeCategoria;
    });

    listaProdutos.innerHTML = "";

    if (produtosFiltrados.length === 0) {

        const mensagem = document.createElement("p");

        mensagem.textContent = produtos.length === 0
            ? "Nenhum produto cadastrado ainda."
            : "Nenhum produto encontrado.";

        mensagem.className = "mensagem-vazia";

        listaProdutos.appendChild(mensagem);

        return;
    }

    produtosFiltrados.forEach(produto => {

        const artigo = document.createElement("article");

        artigo.className = "produto";

        // Imagem
        if (produto.imagem) {

            const imagem = document.createElement("img");

            imagem.src = produto.imagem;
            imagem.alt = produto.nome;

            imagem.className = "imagem-produto";
            imagem.loading = "lazy";

            artigo.appendChild(imagem);

        } else {

            const semImagem = document.createElement("div");

            semImagem.className = "imagem-sem-foto";
            semImagem.textContent = "📷";

            artigo.appendChild(semImagem);
        }

        // Nome
        const nome = document.createElement("h3");

        nome.textContent = produto.nome;

        // Categoria
        const categoria = document.createElement("p");

        categoria.textContent = "Categoria: " + produto.categoria;

        // Preço
        const preco = document.createElement("div");

        preco.className = "preco";
        preco.textContent = formatarPreco(produto.preco);

        // Botão
        const botao = document.createElement("button");

        botao.className = "btn-comprar";
        botao.textContent = "Adicionar ao carrinho";
        botao.type = "button";

        // Montar produto
        artigo.appendChild(nome);
        artigo.appendChild(categoria);
        artigo.appendChild(preco);
        artigo.appendChild(botao);

        listaProdutos.appendChild(artigo);
    });
}

// ======================================
// PESQUISA
// ======================================

if (pesquisaProduto) {

    pesquisaProduto.addEventListener("input", carregarProdutos);
}

// ======================================
// FILTRO DE CATEGORIAS
// ======================================

document.querySelectorAll(".categoria").forEach(botao => {

    botao.addEventListener("click", () => {

        categoriaSelecionada = botao.textContent.trim();

        document.querySelectorAll(".categoria").forEach(item => {
            item.classList.remove("ativo");
        });

        botao.classList.add("ativo");

        carregarProdutos();
    });
});

// ======================================
// INICIALIZAR
// ======================================

carregarProdutos();

// Atualizar caso os produtos mudem em outra aba
window.addEventListener("storage", event => {

    if (event.key === "Produtos") {
        carregarProdutos();
    }
});
