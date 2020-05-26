let inputBuscar = null;
let buttonBuscar = null;

let loadPagina = null;

let form = null;

let totalSexoMasculino = 0;
let totalSexoFeminino = 0;
let somatorioIdades = 0;
let mediaIdades = 0;

let dadosUsuarios = [];
let dadosUsuariosFiltrados = [];
let totalUsuarios = 0;
let collection = null;

let numeroFormatado = null;

window.addEventListener('load', () => {
  form = document.querySelector('form');
  loadPagina = document.querySelector('.preloader-wrapper');

  inputBuscar = document.querySelector('#inputBuscar');

  buttonBuscar = document.querySelector('#buttonBuscar');

  totalSexoMasculino = document.querySelector('#totalSexoMasculino');
  totalSexoFeminino = document.querySelector('#totalSexoFeminino');
  somatorioIdades = document.querySelector('#somatorioIdades');
  mediaIdades = document.querySelector('#mediaIdades');

  totalUsuarios = document.querySelector('#totalUsuarios');
  collection = document.querySelector('.collection');

  numeroFormatado = Intl.NumberFormat('pt-br');

  preloader();
  previnirSubmit();
});

const preloader = () => {
  inputBuscar.disabled = true;
  buttonBuscar.disabled = true;

  setTimeout(() => {
    loadPagina.parentNode.removeChild(loadPagina);
    inputBuscar.disabled = false;
    buttonBuscar.disabled = false;

    ativarInput();
  }, 1200);
};

const previnirSubmit = () => {
  const handleFormSubmit = (event) => {
    event.preventDefault(); // Evita que o formulário seja recarregado
  }

  form.addEventListener('submit', handleFormSubmit);
}

const ativarInput = () => {

  const lidarComDigitacao = (event) => {
    let temTexto = !!inputBuscar.value && inputBuscar.value.trim() !== ''; // Verificação, se o input estiver vazio torna a variavel false, senao true

    if (!temTexto) {
      if (event.key === 'Enter' || event.type === 'click') {
        M.toast({ html: 'Preencha um ao menos uma letra.' });
      }
      return;
    }

    if (event.key === 'Enter' || event.type === 'click') {
      collection.innerHTML = `<div class="progress">
          <div class="indeterminate"></div>
      </div>`;

      buscarUsuarios();
      renderizar();
    }
  };

  buttonBuscar.addEventListener('click', lidarComDigitacao);
  inputBuscar.focus();
};

const buscarUsuarios = async () => {

  const res = await fetch('https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo');
  const dados = await res.json();

  verDadosUsuarios(dados);
};

const verDadosUsuarios = (dados) => {
  dadosUsuarios = dados.results
    .map(usuario => {
      return {
        foto: usuario.picture.medium,
        genero: usuario.gender,
        nome: `${usuario.name.first} ${usuario.name.last}`,
        idade: usuario.dob.age
      };
    });

  filtrarUsuarios();
};

const filtrarUsuarios = () => {
  dadosUsuariosFiltrados = dadosUsuarios.filter((usuario) => {
    usuario.name.toLowerCase().includes(inputBuscar.value.toLowerCase());
  });

  renderizar();
};

const renderizar = () => {
  renderizarEstatisticas();
  renderizarUsuarios();
};

const renderizarEstatisticas = () => {
  totalUsuarios.textContent = dadosUsuarios.length;

  totalSexoMasculino.textContent = contaHomens();
  totalSexoFeminino.textContent = contaMulheres();
  somatorioIdades.textContent = somarIdades();
  mediaIdades.textContent = calcularMediaIdades();

};

const contaHomens = () => {
  let contaHomens = 0;

  dadosUsuarios.forEach(usuario => {
    if (usuario.genero === 'male')
      contaHomens++;
  });

  return contaHomens;
};

const contaMulheres = () => {
  let contaMulheres = 0;

  dadosUsuarios.forEach(usuario => {
    if (usuario.genero === 'female')
      contaMulheres++;
  });

  return contaMulheres;
};

const somarIdades = () => {
  return somatorioIdades = dadosUsuarios.reduce((acumulator, current) => {
    return (acumulator + current.idade);
  }, 0); //0 é o valor inicial do acumulador
};

const calcularMediaIdades = () => {
  let somatorioIdades = dadosUsuarios.reduce((acumulator, current) => {
    return (acumulator + current.idade);
  }, 0); //0 é o valor inicial do acumulador

  return somatorioIdades / dadosUsuarios.length;
};

const renderizarUsuarios = () => {
  let usuariosHTML = "";

  dadosUsuarios.forEach(usuario => {
    usuarioHTML = `
    <li class="collection-item">
      <img src="${usuario.foto}" class="circle">
      <p class="flow-text">${usuario.nome}, <spam>${usuario.idade}</spam> anos</p>
    </li>`;

    usuariosHTML += usuarioHTML;
  });

  collection.innerHTML = usuariosHTML;
};

const formatarNumero = (numero) => {
  return numeroFormatado.format(numero);
}
