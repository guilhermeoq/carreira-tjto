<template>
  <!-- <div class="scroll-buttons position-fixed bottom-0 start-0 m-3 d-flex flex-column gap-2 z-3">
    <button class="btn btn-secondary btn-sm" @click="scrollToTop">
      <i class="bi bi-arrow-up"></i>
    </button>
    <a href="#comparativo" class="btn btn-secondary btn-sm">
      <i class="bi bi-arrow-down"></i>
    </a>
  </div>-->
  <nav class="navbar navbar-expand-lg navbar-collapse">
    <div class="container-fluid">
      <div class="navbar-brand">
        <img src="/android-chrome-192x192.png" width="25" height="25" alt="" />
        <strong>carreiratjto.com</strong>
      </div>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link" href="https://www.al.to.leg.br/arquivos/lei_2409-2010_63738.PDF"
              >Lei n.º 2.409</a
            >
          </li>
          <li class="nav-item">
            <a class="nav-link" href="https://sapl.al.to.leg.br/materia/11972/documentoacessorio"
              >Data-base 2025</a
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <div id="app" class="container-lg">
    <div class="mt-4 mb-3 d-flex justify-content-end">
      <ThemeToggle />
    </div>
    <div class="container-sm">
      <h1 class="title">
        Simulador da Carreira
        <span class="gradient-text">PCCR</span> dos Servidores do TJTO
      </h1>

      <div class="d-block d-md-flex gap-3">
        <p class="subtitle">
          Simule a <strong>evolução na carreira e salário do TJTO</strong>. Visualize progressões e
          detalhes da folha de pagamento neste simulador gratuito desenvolvido para facilitar seu
          planejamento financeiro.
        </p>
      </div>

      <div class="callout callout-info">
        <small
          ><strong>Atualizações [17/12/2025]:</strong><br />
          🚨 Nova opção para simular data-base 2026, com percentual ajustável.<br />
          📅 Você já pode planejar seu 13º salário para 2026! Os cálculos estão ajustados
          considerando a vigência da URV em ambas as parcelas.
        </small>
      </div>

      <div style="text-align: center; margin-top: 2em; margin-bottom: 1em">
        <button type="button" class="btn clearBtn" @click="resetCalculators">
          <strong><i class="bi bi-stars"></i> Limpar</strong>
        </button>
      </div>
      <div class="d-flex justify-content-center gap-3">
        <div style="text-align: center; margin-bottom: 1em">
          <button type="button" class="btn copyBtn" @click="copyCalc1ToCalc2">
            <strong><i class="bi bi-copy"></i> Copiar 1 para 2</strong>
          </button>
        </div>
        <div style="text-align: center; margin-bottom: 1em">
          <button type="button" class="btn swapBtn" @click="swapCalculators">
            <i class="bi bi-arrow-left-right"></i> <strong>Inverter</strong>
          </button>
        </div>
        <div style="text-align: center; margin-bottom: 1em">
          <button type="button" class="btn copyBtn" @click="copyCalc2ToCalc1">
            <strong><i class="bi bi-copy"></i> Copiar 2 para 1</strong>
          </button>
        </div>
      </div>
    </div>
    <div class="d-sm-flex gap-3">
      <div v-for="(calculator, index) in calculators" :key="index" class="calculator">
        <h4>Simulação {{ index + 1 }}</h4>
        <form @change="updateSalary(index)">
          <!-- SWITCH DATABASE-->
          <div class="border-bottom">
            <div class="form-check form-switch mt-4 mb-3">
              <input
                v-model="calculator.simularPercentual"
                class="form-check-input"
                type="checkbox"
                role="switch"
                id="DBSwitch"
              />
              <label class="form-check-label">Simular data-base 2026</label>
            </div>
            <div v-show="calculator.simularPercentual" class="form-floating mb-3 col-5">
              <input
                type="number"
                min="0.00"
                max="50.00"
                step="any"
                class="form-control"
                id="percentualDatabase"
                placeholder="Digite o valor"
                v-model="calculator.percentualDatabase"
              />
              <label>Data-base (%)</label>
            </div>
          </div>

          <div class="d-flex justify-content-center mt-3 gap-3">
            <!-- SELECTION CARGO -->
            <div class="form-floating mb-3 flex-fill">
              <select
                class="form-select"
                id="cargoSelect"
                aria-label="Selecione o cargo"
                v-model="calculator.cargo"
              >
                <option value="tecnico" selected>Técnico Judiciário</option>
                <option value="analista">Analista Judiciário</option>
              </select>
              <label>Cargo</label>
            </div>

            <!-- SELECTION NÍVEL -->
            <div class="form-floating mb-3 flex-fill">
              <select
                class="form-select"
                id="nivel"
                aria-label="Selecione o nível"
                v-model.number="calculator.nivel"
              >
                <option v-for="n in 15" :value="n">{{ n }}</option>
              </select>
              <label>Nível</label>
            </div>
          </div>

          <div class="d-flex flex-wrap justify-content-between gap-1">
            <!-- SELECTION AQFC -->
            <div class="form-floating mb-3 flex-fill">
              <select
                class="form-select"
                id="aqfc"
                aria-label="Selecione o percentual AQFC"
                v-model.number="calculator.aqfc"
              >
                <option v-for="percent in [0, 1, 2, 3]" :value="percent">{{ percent }}%</option>
              </select>
              <label>AQFC</label>
            </div>

            <!-- SELECTION AQE -->
            <div class="form-floating mb-3 flex-fill">
              <select
                class="form-select"
                id="aqe"
                aria-label="Selecione o percentual AQE"
                v-model.number="calculator.aqe"
              >
                <!-- `filteredAQE` -->
                <option
                  v-for="percent in getAqeOptions(calculator.cargo)"
                  :key="percent"
                  :value="percent"
                >
                  {{ percent }}%
                </option>
              </select>
              <label>AQE</label>
            </div>
          </div>

          <!-- SELECTION DEPENDENTE IR -->
          <div class="form-floating mb-3 flex-fill">
            <select
              class="form-select"
              id="dependente"
              aria-label="Nº de dep. IR"
              v-model="calculator.dependente"
            >
              <option v-for="n in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]" :value="n">{{ n }}</option>
            </select>
            <label>Nº dep. IR</label>
          </div>

          <!-- OPÇÕES DE PREVIDENCIA -->
          <div class="border-bottom">
            <p class="mb-0">Previdência:</p>
            <div class="pt-2 pb-1 d-flex flex-wrap gap-3">
              <div class="d-flex flex-row gap-3 flex-wrap">
                <div class="form-check">
                  <input
                    v-model="calculator.tipoPrevidencia"
                    class="form-check-input"
                    type="radio"
                    name="tipoPrevidencia"
                    value="prevcom"
                    id="prevcom"
                    checked
                  />
                  <label class="form-check-label"> Complementar</label>
                </div>
                <div class="form-check">
                  <input
                    v-model="calculator.tipoPrevidencia"
                    class="form-check-input"
                    type="radio"
                    name="tipoPrevidencia"
                    value="igeprevNovo"
                    id="igeprevNovo"
                  />
                  <label class="form-check-label"> IGEPREV (novo) </label>
                </div>
                <div class="form-check">
                  <input
                    v-model="calculator.tipoPrevidencia"
                    class="form-check-input"
                    type="radio"
                    name="tipoPrevidencia"
                    value="igeprevAntigo"
                    id="igeprevAntigo"
                  />
                  <label class="form-check-label"> IGEPREV (antigo) </label>
                </div>
              </div>
            </div>
            <div class="mb-2">
              <div></div>
              <i v-show="calculator.tipoPrevidencia === 'prevcom'"
                ><small>*IGEPREV (14%) + BRASILPREV (8,5%).</small></i
              >
              <i v-show="calculator.tipoPrevidencia === 'igeprevNovo'"
                ><small>*IGEPREV (14% limitado ao teto).</small></i
              >
              <i v-show="calculator.tipoPrevidencia === 'igeprevAntigo'"
                ><small>*IGEPREV (14% sobre todo o salário).</small></i
              >
            </div>
          </div>

          <div class="mt-3 form-check form-switch mb-3">
            <input
              v-model="calculator.switchFuncao"
              class="form-check-input"
              type="checkbox"
              role="switch"
              id="switchFuncao"
            />
            <label class="form-check-label">Funções </label>
          </div>

          <!-- Funcao do Servidor -->
          <div class="d-flex flex-wrap justify-content-between gap-1 mb-1">
            <div v-if="calculator.switchFuncao" class="form-floating mb-1 flex-fill col-3">
              <select
                class="form-select"
                id="funcaoServidor"
                aria-label="Idade do Servidor"
                v-model="calculator.funcaoServidor"
              >
                <option
                  v-for="n in [
                    'DAJ-1',
                    'DAJ-2',
                    'DAJ-3',
                    'DAJ-4',
                    'DAJ-5',
                    'DAJ-6',
                    'DAJ-7',
                    'DAJ-8',
                    'DAJ-9',
                    'DAJ-10',
                    'DAJ-11',
                    'FC-1',
                    'FC-2',
                    'FC-3',
                    'FC-4',
                  ]"
                  :value="n"
                >
                  {{ n }}
                </option>
              </select>
              <label>Selecione o cargo/função </label>

              <div class="mt-2">
                <i><small>*Considerando opção pelo cargo efetivo +65% para funções DAJ.</small></i>
              </div>
            </div>
          </div>

          <div class="border-top">
            <div class="form-check form-switch gap-1 mb-3 mt-3">
              <input
                v-model="calculator.switchFerias"
                class="form-check-input"
                type="checkbox"
                role="switch"
                id="ferias"
              />
              <label class="form-check-label">Adicional de Férias</label>
            </div>
          </div>

          <!-- SELECTION 13 SALARIO -->
          <div class="border-top pt-3 pb-3 d-flex flex-wrap gap-3">
            <div class="d-flex flex-row gap-3">
              <div class="form-check form-switch">
                <input
                  v-model="calculator.switchDecimo"
                  class="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="decimo"
                />
                <label class="form-check-label">13º Salário </label>
              </div>
            </div>

            <!-- OPÇÕES DO 13º SALARIO -->
            <div class="d-flex flex-row gap-3">
              <div class="form-check">
                <input
                  v-model="calculator.tipoDecimo"
                  class="form-check-input"
                  type="radio"
                  name="tipoDecimo"
                  value="integral"
                  id="integral"
                  :disabled="!calculator.switchDecimo"
                  checked
                />
                <label class="form-check-label"> Integral </label>
              </div>
              <div class="form-check">
                <input
                  v-model="calculator.tipoDecimo"
                  class="form-check-input"
                  type="radio"
                  name="tipoDecimo"
                  value="parcela1"
                  id="parcela1"
                  :disabled="!calculator.switchDecimo"
                />
                <label class="form-check-label"> 1ª Parcela </label>
              </div>
              <div class="form-check">
                <input
                  v-model="calculator.tipoDecimo"
                  class="form-check-input"
                  type="radio"
                  name="tipoDecimo"
                  value="parcela2"
                  id="parcela2"
                  :disabled="!calculator.switchDecimo"
                />
                <label class="form-check-label"> 2ª Parcela </label>
              </div>
            </div>
          </div>

          <!-- SELECTION AUXILIO SAUDE -->
          <div class="border-top border-bottom">
            <div class="mt-3 form-check form-switch mb-3">
              <input
                v-model="calculator.switchSaude"
                class="form-check-input"
                type="checkbox"
                role="switch"
                id="switchSaude"
              />
              <label class="form-check-label">Auxílio Saúde</label>
            </div>

            <div v-if="calculator.switchSaude" class="mt-3 form-check form-switch mb-3">
              <input
                v-model="calculator.switchTetoSaude"
                class="form-check-input"
                type="checkbox"
                role="switch"
                id="switchTetoSaude"
              />
              <label class="form-check-label">Recebe o teto?</label>
            </div>

            <!-- Faixa Etaria - Idade Servidor -->
            <div class="d-flex flex-wrap justify-content-between gap-1">
              <div
                v-if="
                  calculator.switchSaude &&
                  !calculator.switchTetoSaude &&
                  !calculator.switchTetoSaude
                "
                class="form-floating mb-1 flex-fill col-3"
              >
                <select
                  class="form-select border-primary border-2"
                  id="idadeServidor"
                  aria-label="Idade do Servidor"
                  v-model="calculator.faixaEtariaServidor"
                >
                  <option
                    v-for="n in [
                      '0-18',
                      '19-23',
                      '24-28',
                      '29-33',
                      '34-38',
                      '39-43',
                      '44-48',
                      '49-53',
                      '54-58',
                      '59+',
                    ]"
                    :value="n"
                  >
                    {{ n }}
                  </option>
                </select>
                <label>Idade Servidor</label>
              </div>
              <div
                v-if="calculator.switchSaude && !calculator.switchTetoSaude"
                class="form-floating mb-1 col-6"
              >
                <input
                  type="number"
                  min="0.00"
                  max="10000.00"
                  step="any"
                  class="form-control border-primary border-2"
                  id="mensalidadeServidor"
                  placeholder="Digite o valor"
                  v-model="calculator.mensalidadeServidor"
                />
                <label>Valor Servidor (R$)</label>
              </div>
            </div>
            <div
              v-if="calculator.switchSaude && !calculator.switchTetoSaude"
              class="progress mb-3"
              role="progressbar"
              aria-label="Limite Servidor"
              :aria-valuenow="
                (
                  (calculator.mensalidadeServidor * 100) /
                  consultaReembolso(calculator.faixaEtariaServidor)
                ).toFixed(2)
              "
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div
                class="progress-bar bg-primary"
                :style="{
                  width:
                    (calculator.mensalidadeServidor * 100) /
                      consultaReembolso(calculator.faixaEtariaServidor) +
                    '%',
                }"
              >
                {{
                  (
                    (calculator.mensalidadeServidor * 100) /
                    consultaReembolso(calculator.faixaEtariaServidor)
                  ).toFixed(2) + '%'
                }}
              </div>
            </div>

            <!-- Faixa Etaria - Idade Dependente 1 -->
            <div
              v-if="calculator.switchSaude && !calculator.switchTetoSaude"
              class="d-flex flex-wrap justify-content-between gap-1"
            >
              <div class="form-floating mb-1 flex-fill col-3">
                <select
                  class="form-select border-success border-2"
                  id="idadeDependente1"
                  aria-label="Idade do Dependente 1"
                  v-model="calculator.faixaEtariaDependente1"
                >
                  <option
                    v-for="n in [
                      '0-18',
                      '19-23',
                      '24-28',
                      '29-33',
                      '34-38',
                      '39-43',
                      '44-48',
                      '49-53',
                      '54-58',
                      '59+',
                    ]"
                    :value="n"
                  >
                    {{ n }}
                  </option>
                </select>
                <label>Idade Dep. 1</label>
              </div>
              <div class="form-floating mb-1 col-6">
                <input
                  type="number"
                  min="0.00"
                  max="10000.00"
                  step="any"
                  class="form-control border-success border-2"
                  id="mensalidadeDependente1"
                  placeholder="Digite o valor"
                  v-model="calculator.mensalidadeDependente1"
                />
                <label>Valor Dep. 1 (R$)</label>
              </div>
            </div>
            <div
              v-if="calculator.switchSaude && !calculator.switchTetoSaude"
              class="progress mb-3"
              role="progressbar"
              aria-label="Limite Dependente 1"
              :aria-valuenow="
                (
                  (calculator.mensalidadeDependente1 * 100) /
                  consultaReembolso(calculator.faixaEtariaDependente1)
                ).toFixed(2)
              "
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div
                class="progress-bar bg-success"
                :style="{
                  width:
                    (calculator.mensalidadeDependente1 * 100) /
                      consultaReembolso(calculator.faixaEtariaDependente1) +
                    '%',
                }"
              >
                {{
                  (
                    (calculator.mensalidadeDependente1 * 100) /
                    consultaReembolso(calculator.faixaEtariaDependente1)
                  ).toFixed(2) + '%'
                }}
              </div>
            </div>

            <!-- Faixa Etaria - Idade Dependente 2 -->
            <div
              v-if="calculator.switchSaude && !calculator.switchTetoSaude"
              class="d-flex flex-wrap justify-content-between gap-1"
            >
              <div class="form-floating mb-3 flex-fill col-3">
                <select
                  class="form-select border-warning border-2"
                  id="idadeDependente2"
                  aria-label="Idade do Dependente 2"
                  v-model="calculator.faixaEtariaDependente2"
                >
                  <option
                    v-for="n in [
                      '0-18',
                      '19-23',
                      '24-28',
                      '29-33',
                      '34-38',
                      '39-43',
                      '44-48',
                      '49-53',
                      '54-58',
                      '59+',
                    ]"
                    :value="n"
                  >
                    {{ n }}
                  </option>
                </select>
                <label>Idade Dep. 2</label>
              </div>
              <div
                v-show="calculator.switchSaude && !calculator.switchTetoSaude"
                class="form-floating mb-3 col-6"
              >
                <input
                  type="number"
                  min="0.00"
                  max="10000.00"
                  step="any"
                  class="form-control border-warning border-2"
                  id="mensalidadeDependente2"
                  placeholder="Digite o valor"
                  v-model="calculator.mensalidadeDependente2"
                />
                <label>Valor Dep. 2 (R$)</label>
              </div>
            </div>
            <div
              v-if="calculator.switchSaude && !calculator.switchTetoSaude"
              class="progress mb-3"
              role="progressbar"
              aria-label="Limite Dependente 2"
              :aria-valuenow="
                (
                  (calculator.mensalidadeDependente2 * 100) /
                  consultaReembolso(calculator.faixaEtariaDependente2)
                ).toFixed(2)
              "
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div
                class="progress-bar bg-warning"
                :style="{
                  width:
                    (calculator.mensalidadeDependente2 * 100) /
                      consultaReembolso(calculator.faixaEtariaDependente2) +
                    '%',
                }"
              >
                {{
                  (
                    (calculator.mensalidadeDependente2 * 100) /
                    consultaReembolso(calculator.faixaEtariaDependente2)
                  ).toFixed(2) + '%'
                }}
              </div>
            </div>

            <!-- Faixa Etaria - Idade Dependente 3 -->
            <div
              v-if="calculator.switchSaude && !calculator.switchTetoSaude"
              class="d-flex flex-wrap justify-content-between gap-1"
            >
              <div class="form-floating mb-1 flex-fill col-3">
                <select
                  class="form-select border-danger border-2"
                  id="idadeDependente3"
                  aria-label="Idade do Dependente 3"
                  v-model="calculator.faixaEtariaDependente3"
                >
                  <option
                    v-for="n in [
                      '0-18',
                      '19-23',
                      '24-28',
                      '29-33',
                      '34-38',
                      '39-43',
                      '44-48',
                      '49-53',
                      '54-58',
                      '59+',
                    ]"
                    :value="n"
                  >
                    {{ n }}
                  </option>
                </select>
                <label>Idade Dep. 3+</label>
              </div>

              <div class="form-floating mb-1 col-6">
                <input
                  type="number"
                  min="0.00"
                  max="10000.00"
                  step="any"
                  class="form-control border-danger border-2"
                  id="mensalidadeDependente3"
                  placeholder="Digite o valor"
                  v-model="calculator.mensalidadeDependente3"
                />
                <label>Valor Dep. 3 (R$)</label>
              </div>
            </div>
            <div
              v-if="calculator.switchSaude && !calculator.switchTetoSaude"
              class="progress mb-3"
              role="progressbar"
              aria-label="Limite Dependente 3"
              :aria-valuenow="
                (
                  (calculator.mensalidadeDependente3 * 100) /
                  consultaReembolso(calculator.faixaEtariaDependente3)
                ).toFixed(2)
              "
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div
                class="progress-bar bg-danger"
                :style="{
                  width:
                    (calculator.mensalidadeDependente3 * 100) /
                      consultaReembolso(calculator.faixaEtariaDependente3) +
                    '%',
                }"
              >
                {{
                  (
                    (calculator.mensalidadeDependente3 * 100) /
                    consultaReembolso(calculator.faixaEtariaDependente3)
                  ).toFixed(2) + '%'
                }}
              </div>
            </div>

            <div
              v-if="calculator.switchSaude && !calculator.switchTetoSaude"
              class="input-group mb-3 flex-fill"
            >
              <label class="input-group-text">Multiplicar 'Dep. 3' x</label>
              <select
                v-model="calculator.multiplicadorDependente3"
                class="form-select"
                id="multiplicador"
              >
                <option v-for="n in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]" :value="n">
                  {{ n }}
                </option>
              </select>
            </div>

            <!-- BARRA PERCENTUAL - TETO GLOBAL DO PLANO DE SAUDE -->
            <div
              v-if="calculator.switchSaude && !calculator.switchTetoSaude"
              class="progress-stacked border-bottom"
            >
              <div
                class="progress"
                role="progressbar"
                aria-label="Servidor"
                :aria-valuenow="calculator.percentualSaudeServidor"
                aria-valuenow=""
                aria-valuemin="0"
                aria-valuemax="100"
                :style="{ width: calculator.percentualSaudeServidor + '%' }"
              >
                <div
                  class="progress-bar progress-bar-striped progress-bar-animated bg-primary"
                ></div>
              </div>
              <div
                class="progress"
                role="progressbar"
                aria-label="Dep. 1"
                :aria-valuenow="calculator.percentualSaudeDep1"
                aria-valuenow=""
                aria-valuemin="0"
                aria-valuemax="100"
                :style="{ width: calculator.percentualSaudeDep1 + '%' }"
              >
                <div
                  class="progress-bar progress-bar-striped progress-bar-animated bg-success"
                ></div>
              </div>
              <div
                class="progress"
                role="progressbar"
                aria-label="Dep. 2"
                aria-valuenow="{{calculator.percentualSaudeDep2}}"
                aria-valuemin="0"
                aria-valuemax="100"
                :style="{ width: calculator.percentualSaudeDep2 + '%' }"
              >
                <div
                  class="progress-bar progress-bar-striped progress-bar-animated bg-warning"
                ></div>
              </div>
              <div
                class="progress"
                role="progressbar"
                aria-label="Dep. 3"
                aria-valuenow="{{calculator.percentualSaudeDep3}}"
                aria-valuemin="0"
                aria-valuemax="100"
                :style="{ width: calculator.percentualSaudeDep3 + '%' }"
              >
                <div
                  class="progress-bar progress-bar-striped progress-bar-animated bg-danger"
                ></div>
              </div>
            </div>
          </div>

          <div
            v-if="calculator.switchSaude && !calculator.switchTetoSaude"
            class="d-flex flex-wrap justify-content-center"
          >
            <p>
              <small><strong>Teto Aux. Saúde: R$ 3.408,34</strong></small>
            </p>
          </div>
          <p class="mb-0 mt-2">Outros descontos:</p>
          <div class="mt-1 form-floating mb-1 col-5">
            <input
              type="number"
              min="0.00"
              max="10000.00"
              step="any"
              class="form-control"
              id="outrosDescontos"
              placeholder="Digite o valor"
              v-model="calculator.outrosDescontos"
            />
            <label>Valor (R$)</label>
          </div>
        </form>
        <div>
          <h5 style="margin-top: 10px">Rendimentos</h5>
          <p class="tab-rendimento">
            <strong> <i class="bi bi-wallet-fill"></i> Vencimento Básico:</strong>
            {{ formatarParaBR(calculator.vencimentoBasico) }}
          </p>
          <p class="tab-rendimento">
            <strong><i class="bi bi-plus-circle-fill"></i> GAJ (30%):</strong>
            {{ formatarParaBR(calculator.gaj) }}
          </p>
          <p class="tab-rendimento">
            <strong> <i class="bi bi-mortarboard-fill"></i> AQE:</strong>
            {{ formatarParaBR(calculator.aqeValue) }}
          </p>
          <p class="tab-rendimento">
            <strong> <i class="bi bi-file-earmark-medical-fill"></i> AQFC:</strong>
            {{ formatarParaBR(calculator.aqfcValue) }}
          </p>
          <p v-show="calculator.switchFuncao" class="tab-representacao">
            <strong> <i class="bi bi-person-fill-up"></i> Representação (Função):</strong>
            {{ formatarParaBR(calculator.representacao) }}
          </p>
          <p class="tab-alimentacao">
            <strong> <i class="bi bi-basket-fill"></i> Aux. Alimentação:</strong> R$ 2.122,00
          </p>
          <p v-show="calculator.switchSaude" class="tab-saude">
            <strong> <i class="bi bi-hospital-fill"></i> Aux. Saúde:</strong>
            {{ formatarParaBR(calculator.saude) }}
          </p>
          <p v-show="calculator.switchFerias" class="tab-ferias">
            <strong> <i class="bi bi-suitcase-fill"></i> Adicional de Férias:</strong>
            {{ formatarParaBR(calculator.ferias) }}
          </p>
          <p
            v-show="calculator.switchDecimo && calculator.tipoDecimo === 'parcela1'"
            class="tab-decimo"
          >
            <strong> <i class="bi bi-gem"></i> 13º Salário:</strong>
            {{ formatarParaBR(calculator.decimoparcela1) }}
          </p>
          <p class="tab-bruto">
            <i class="bi bi-caret-up-fill"></i> Salário Bruto:
            {{ formatarParaBR(calculator.salarioBruto) }}
          </p>
        </div>
        <div>
          <h5 style="margin-top: 10px">Descontos</h5>
          <p class="tab-desconto">
            <strong><i class="bi bi-people-fill"></i> IGEPREV:</strong>
            {{ formatarParaBR(calculator.previdencia) }}
          </p>
          <p v-show="calculator.tipoPrevidencia === 'prevcom'" class="tab-desconto">
            <strong> <i class="bi bi-people-fill"></i> BRASILPREV:</strong>
            {{ formatarParaBR(calculator.prevcom) }}
          </p>
          <p class="tab-desconto">
            <strong><i class="bi bi-bank2"></i> IRRF:</strong> {{ formatarParaBR(calculator.irrf) }}
          </p>
          <p class="tab-desconto" v-show="calculator.teto > 0">
            <strong><i class="bi bi-building-fill-exclamation"></i> Teto:</strong>
            {{ formatarParaBR(calculator.teto) }}
          </p>
          <p class="tab-desconto" v-show="calculator.outrosDescontos > 0">
            <strong><i class="bi bi-cash-stack"></i> Outros Descontos:</strong>
            {{ formatarParaBR(calculator.outrosDescontos) }}
          </p>
          <p class="tab-desconto-total">
            <i class="bi bi-caret-down-fill"></i> Total de Descontos:
            {{ formatarParaBR(calculator.totalDescontos) }}
          </p>
        </div>
        <p class="tab-liquido">
          <i class="bi bi-caret-right-fill"></i> Salário Líquido:
          {{ formatarParaBR(calculator.salarioLiquido) }}
        </p>
        <div
          v-show="
            calculator.switchDecimo &&
            (calculator.tipoDecimo === 'integral' || calculator.tipoDecimo === 'parcela2')
          "
          class="border-top"
        >
          <h5 style="margin-top: 10px">Folha do 13º Salário</h5>
          <p class="tab-decimo">
            <strong> <i class="bi bi-gem"></i> 13º Salário:</strong>
            {{ formatarParaBR(calculator.decimoFolhaComplementar) }}
          </p>
          <p
            v-show="calculator.switchDecimo && calculator.tipoDecimo === 'parcela2'"
            class="tab-desconto"
          >
            <strong><i class="bi bi-receipt"></i> Adiantamento 13º:</strong>
            {{ formatarParaBR(calculator.decimoAdiantamento) }}
          </p>
          <p class="tab-desconto">
            <strong><i class="bi bi-people-fill"></i> IGEPREV 13º:</strong>
            {{ formatarParaBR(calculator.decimoPrevidencia) }}
          </p>
          <p v-show="calculator.tipoPrevidencia === 'prevcom'" class="tab-desconto">
            <strong> <i class="bi bi-people-fill"></i> BRASILPREV 13º:</strong>
            {{ formatarParaBR(calculator.prevcom) }}
          </p>
          <p class="tab-desconto">
            <strong><i class="bi bi-bank2"></i> IRRF do 13º:</strong>
            {{ formatarParaBR(calculator.decimoIRRF) }}
          </p>
          <p class="tab-desconto-total">
            <i class="bi bi-caret-down-fill"></i> Total de Descontos 13º:
            {{ formatarParaBR(calculator.totalDescontosDecimo) }}
          </p>
          <p class="tab-liquido">
            <i class="bi bi-caret-right-fill"></i> 13º Salário Líquido:
            {{ formatarParaBR(calculator.decimoLiquido) }}
          </p>
          <div class="border-top"></div>
          <p class="tab-salario-e-decimo">
            <i class="bi bi-caret-right-fill"></i> Total Líquido (Salário + 13º):
            {{ formatarParaBR(calculator.decimoLiquido + calculator.salarioLiquido) }}
          </p>
        </div>
        <div></div>
      </div>
    </div>
    <div style="text-align: center; margin-top: 1em; margin-bottom: 1em">
      <h5 id="comparativo" style="margin-bottom: 0">
        Comparação:
        <span :class="{ positive: comparativo > 0, negative: comparativo < 0 }">
          {{ formatarParaBR(comparativo) }}</span
        >
      </h5>
      <p><small>(diferença de valor líquido entre as simulações)</small></p>
    </div>
    <div class="container d-flex justify-content-center align-items-center">
      <p class="footer">
        Desenvolvido por
        <a href="https://guilhermeoq.github.io" class="link"
          >Guilherme Quintino <i class="bi bi-box-arrow-up-right"></i></a
        >. Este simulador é gratuito, não coleta nenhuma informação pessoal e foi desenvolvido com
        base em dados do Portal da Transparência e da legislação vigente.<br />Os valores calculados
        nesta página não podem ser considerados 100% corretos devido a possíveis erros nos cálculos
        e nos valores e alíquotas de impostos e gratificações. Não me responsabilizo por eventuais
        diferenças entre a simulação e os valores reais. Caso você tenha alguma sugestão ou
        comentário, por favor entre em contato pelo e-mail
        <a class="link" href="mailto:contato@carreiratjto.com">contato@carreiratjto.com</a>.
      </p>
    </div>

    <div class="badge container d-flex justify-content-center align-items-center gap-3">
      <a href="https://vuejs.org">
        <img
          src="https://img.shields.io/badge/Built%20with%20Vue-grey?style=for-the-badge&logo=vuedotjs&&color=35495e"
          alt="Built with Vue.js"
        />
      </a>
      <a href="https://vercel.com">
        <img
          src="https://img.shields.io/badge/Powered%20by%20Vercel-grey?style=for-the-badge&logo=vercel&color=292929"
          alt="Powered by Vercel"
        />
      </a>
    </div>
    <p class="copyright">© {{ currentYear }} carreiratjto.com. Todos os direitos reservados.</p>
  </div>
</template>

<script>
import ThemeToggle from './ThemeToggle.vue'
export default {
  data() {
    return {
      calculators: [this.createCalculator(), this.createCalculator()],
    }
  },
  components: {
    ThemeToggle,
  },
  computed: {
    comparativo() {
      const [calc0, calc1] = this.calculators

      const total0 = calc0.salarioLiquido + (calc0.switchDecimo ? calc0.decimoLiquido : 0)
      const total1 = calc1.salarioLiquido + (calc1.switchDecimo ? calc1.decimoLiquido : 0)

      return total1 - total0
    },
    currentYear() {
      return new Date().getFullYear()
    },
  },

  methods: {
    //Inicializar calculadora
    createCalculator() {
      return {
        simularPercentual: false,
        percentualDatabase: 4.0,
        switchSaude: false,
        switchTetoSaude: false,
        cargo: 'tecnico',
        nivel: 1,
        aqfc: 3,
        aqe: 7.5,
        dependente: 0,
        tipoPrevidencia: 'prevcom',
        switchFuncao: false,
        funcaoServidor: 'DAJ-1',
        representacao: 0,
        ferias: 0,
        saude: 0,
        faixaEtariaServidor: '0-18',
        faixaEtariaDependente1: '0-18',
        faixaEtariaDependente2: '0-18',
        faixaEtariaDependente3: '0-18',
        multiplicadorDependente3: 1,
        mensalidadeServidor: 0.0,
        mensalidadeDependente1: 0.0,
        mensalidadeDependente2: 0.0,
        mensalidadeDependente3: 0.0,
        percentualSaudeServidor: 0,
        percentualSaudeDep1: 0,
        percentualSaudeDep2: 0,
        percentualSaudeDep3: 0,
        outrosDescontos: 0.0,
        decimoparcela1: 0,
        decimoAdiantamento: 0,
        decimoFolhaComplementar: 0,
        decimoPrevidencia: 0,
        decimoPrevcom: 0,
        decimoIRRF: 0,
        decimoLiquido: 0,
        tipoDecimo: 'integral',
        vencimentoBasico: 0,
        gaj: 0,
        aqfcValue: 0,
        aqeValue: 0,
        salarioBruto: 0,
        previdencia: 0,
        prevcom: 0,
        irrf: 0,
        teto: 0,
        totalDescontos: 0,
        salarioLiquido: 0,
        totalDescontosDecimo: 0,
      }
    },
    saveCalculatorsToLocalStorage() {
      localStorage.setItem('calculators-store', JSON.stringify(this.calculators))
    },
    resetCalculators() {
      this.calculators = [this.createCalculator(), this.createCalculator()]
      this.calculators.forEach((_, index) => this.updateSalary(index)) // recalculate
    },
    swapCalculators() {
      ;[this.calculators[0], this.calculators[1]] = [this.calculators[1], this.calculators[0]]
      this.saveCalculatorsToLocalStorage()
    },
    copyCalc1ToCalc2() {
      this.calculators[1] = JSON.parse(JSON.stringify(this.calculators[0]))
      this.updateSalary(1)
      this.saveCalculatorsToLocalStorage()
    },
    copyCalc2ToCalc1() {
      this.calculators[0] = JSON.parse(JSON.stringify(this.calculators[1]))
      this.updateSalary(0)
      this.saveCalculatorsToLocalStorage()
    },
    /* scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    scrollToBottom() {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, */

    //Opções de AQE conforme cargo
    getAqeOptions(cargo) {
      if (cargo === 'analista') {
        return [0, 7.5, 10, 12.5]
      }
      return [0, 5, 7.5, 10, 12.5]
    },
    //Atualizar cálculo do salário
    updateSalary(index) {
      const calculator = this.calculators[index]
      const tetoIgeprev = 8157.41
      const salarios = {
        tecnico: [
          8329.27, 8745.73, 9183.02, 9642.17, 10124.27, 10630.47, 11162.03, 11720.11, 12306.13,
          12921.42, 13567.49, 14245.88, 14958.17, 15706.08, 16491.4,
        ],
        analista: [
          13944.81, 14642.07, 15374.18, 16142.87, 16950.0, 17797.51, 18687.38, 19621.75, 20602.77,
          21633.0, 22714.63, 23850.35, 25042.89, 26295.03, 27609.79,
        ],
      }

      const vb = salarios[calculator.cargo][calculator.nivel - 1]
      calculator.vencimentoBasico = calculator.simularPercentual
        ? vb * (1 + calculator.percentualDatabase / 100)
        : vb //simularPercentual
      calculator.gaj = calculator.vencimentoBasico * 0.3
      calculator.aqfcValue = calculator.vencimentoBasico * (calculator.aqfc / 100)
      calculator.aqeValue = calculator.vencimentoBasico * (calculator.aqe / 100)

      if (calculator.switchFuncao == true) {
        calculator.simularPercentual === true
          ? (calculator.representacao =
              this.consultaValorFuncao(calculator.funcaoServidor) *
              (1 + calculator.percentualDatabase / 100)) //simularPercentual
          : (calculator.representacao = this.consultaValorFuncao(calculator.funcaoServidor))
      } else calculator.representacao = 0

      calculator.ferias = calculator.switchFerias
        ? (calculator.vencimentoBasico +
            calculator.gaj +
            calculator.aqfcValue +
            calculator.aqeValue +
            calculator.representacao) /
          3
        : 0

      if (calculator.switchSaude == true) {
        let auxilioServidor = 0
        let auxilioDependente1 = 0
        let auxilioDependente2 = 0
        let auxilioDependente3 = 0
        let reembolsoAgregado = 0

        // Consulta teto de reembolso Aux.Saude para Servidor
        if (
          calculator.mensalidadeServidor >= this.consultaReembolso(calculator.faixaEtariaServidor)
        )
          auxilioServidor = this.consultaReembolso(calculator.faixaEtariaServidor)
        else auxilioServidor = calculator.mensalidadeServidor
        //console.log(`Auxilio Servidor:  ${auxilioServidor}`)

        // Consulta teto de reembolso Aux.Saude para Dependente 1
        if (
          calculator.mensalidadeDependente1 >=
          this.consultaReembolso(calculator.faixaEtariaDependente1)
        )
          auxilioDependente1 = this.consultaReembolso(calculator.faixaEtariaDependente1)
        else auxilioDependente1 = calculator.mensalidadeDependente1
        //console.log(`Auxilio Dependente 1: ${auxilioDependente1}`)

        // Consulta teto de reembolso Aux.Saude para Dependente 2
        if (
          calculator.mensalidadeDependente2 >=
          this.consultaReembolso(calculator.faixaEtariaDependente2)
        )
          auxilioDependente2 = this.consultaReembolso(calculator.faixaEtariaDependente2)
        else auxilioDependente2 = calculator.mensalidadeDependente2
        //console.log(`Auxilio Dependente 2: ${auxilioDependente2}`)

        // Consulta teto de reembolso Aux.Saude para Dependente 3
        if (
          calculator.mensalidadeDependente3 >=
          this.consultaReembolso(calculator.faixaEtariaDependente3)
        )
          auxilioDependente3 =
            this.consultaReembolso(calculator.faixaEtariaDependente3) *
            calculator.multiplicadorDependente3
        else
          (auxilioDependente3 =
            calculator.mensalidadeDependente3 * calculator.multiplicadorDependente3),
            // console.log(`Auxilio Dependente 3 x
            // ${calculator.multiplicadorDependente3}
            // = ${auxilioDependente3}`)

            //Somatório dos reembolsos apurados conforme tetos por faixa etária
            (reembolsoAgregado = parseFloat(
              auxilioServidor + auxilioDependente1 + auxilioDependente2 + auxilioDependente3,
            ))
        calculator.saude = reembolsoAgregado >= 3408.34 ? 3408.34 : reembolsoAgregado

        calculator.percentualSaudeServidor = this.percentualTetoSaude(auxilioServidor)
        calculator.percentualSaudeDep1 = this.percentualTetoSaude(auxilioDependente1)
        calculator.percentualSaudeDep2 = this.percentualTetoSaude(auxilioDependente2)
        calculator.percentualSaudeDep3 = this.percentualTetoSaude(auxilioDependente3)
        //console.log(`PERCENTUAIS:
        // Servidor: ${calculator.percentualSaudeServidor}
        // Dep1: ' + calculator.percentualSaudeDep1
        // Dep2: ${calculator.percentualSaudeDep2}
        // Dep3: ${calculator.percentualSaudeDep3}`)
      } else calculator.saude = 0.0

      if (calculator.switchTetoSaude == true && calculator.switchSaude == true) {
        calculator.mensalidadeServidor = 0.0
        calculator.mensalidadeDependente1 = 0.0
        calculator.mensalidadeDependente2 = 0.0
        calculator.mensalidadeDependente3 = 0.0
        calculator.saude = 3408.34
      }

      //Cálculo do 13º salário integral - incluso em folha complementar
      calculator.decimoFolhaComplementar =
        calculator.switchDecimo &&
        (calculator.tipoDecimo === 'integral' || calculator.tipoDecimo === 'parcela2')
          ? calculator.vencimentoBasico +
            calculator.gaj +
            calculator.aqfcValue +
            calculator.aqeValue +
            calculator.representacao
          : 0

      //Cálculo da 1ª parcela do 13º salário - incluso em folha normal
      calculator.decimoparcela1 =
        calculator.switchDecimo && calculator.tipoDecimo === 'parcela1'
          ? (calculator.vencimentoBasico +
              calculator.gaj +
              calculator.aqfcValue +
              calculator.aqeValue +
              calculator.representacao) /
            2
          : 0

      //Cálculo do desconto de adiantamento da 1ª parcela do 13º salário
      calculator.decimoAdiantamento = calculator.decimoFolhaComplementar / 2

      calculator.decimoPrevidencia =
        calculator.switchDecimo &&
        (calculator.tipoDecimo === 'integral' || calculator.tipoDecimo === 'parcela2')
          ? calculator.tipoPrevidencia === 'prevcom' || calculator.tipoPrevidencia === 'igeprevNovo'
            ? this.calcularPrevidencia(tetoIgeprev)
            : (calculator.vencimentoBasico + calculator.gaj + calculator.aqeValue) * 0.14
          : calculator.switchDecimo && calculator.tipoDecimo === 'parcela1'
            ? 0
            : 0

      calculator.decimoPrevcom =
        calculator.switchDecimo &&
        (calculator.tipoDecimo === 'integral' || calculator.tipoDecimo === 'parcela2')
          ? calculator.vencimentoBasico + calculator.gaj + calculator.aqeValue >= tetoIgeprev
            ? (calculator.vencimentoBasico + calculator.gaj + calculator.aqeValue - tetoIgeprev) *
              0.085
            : 0
          : calculator.switchDecimo && calculator.tipoDecimo === 'parcela1'
            ? 0
            : 0

      //Cálculo do IRRF sobre o 13º salário
      calculator.decimoIRRF = this.calcularIrrf(calculator.decimoFolhaComplementar)

      const baseIRRFDecimo =
        calculator.tipoPrevidencia === 'prevcom'
          ? calculator.vencimentoBasico +
            calculator.gaj +
            calculator.aqeValue +
            calculator.aqfcValue +
            calculator.representacao -
            (calculator.decimoPrevidencia +
              calculator.decimoPrevcom +
              189.59 * calculator.dependente)
          : calculator.vencimentoBasico +
            calculator.gaj +
            calculator.aqeValue +
            calculator.aqfcValue +
            calculator.representacao -
            (calculator.decimoPrevidencia + 189.59 * calculator.dependente)

      calculator.decimoIRRF = this.calcularIrrf(baseIRRFDecimo)

      //Total de descontos aplicados sobre o 13º salário
      calculator.totalDescontosDecimo =
        calculator.switchDecimo && calculator.tipoDecimo === 'integral'
          ? calculator.tipoPrevidencia === 'prevcom'
            ? calculator.decimoPrevidencia + calculator.decimoPrevcom + calculator.decimoIRRF
            : calculator.decimoPrevidencia + calculator.decimoIRRF
          : calculator.switchDecimo && calculator.tipoDecimo === 'parcela2'
            ? calculator.tipoPrevidencia === 'prevcom'
              ? calculator.decimoAdiantamento +
                calculator.decimoPrevidencia +
                calculator.decimoPrevcom +
                calculator.decimoIRRF
              : calculator.decimoAdiantamento + calculator.decimoPrevidencia + calculator.decimoIRRF
            : calculator.switchDecimo && calculator.tipoDecimo === 'parcela1'
              ? 0
              : 0

      //Cálculo do 13º Líquido - folha complementar
      calculator.decimoLiquido =
        calculator.decimoFolhaComplementar - calculator.totalDescontosDecimo

      //Cálculo do Salário Bruto
      calculator.salarioBruto =
        calculator.vencimentoBasico +
        calculator.gaj +
        calculator.aqfcValue +
        calculator.aqeValue +
        calculator.representacao +
        calculator.ferias +
        calculator.saude +
        calculator.decimoparcela1 +
        2122

      //Cálculo do teto/sub-teto (2024: 29196.14 / 2025: 30760.27)
      //Como o sub-teto parece estar inativo, o teto é -5% do subsídio dos ministros do STF.
      //R$ 41.650,92 a partir de 1º de abril de 2023
      //R$ 44.008,52 a partir de 1º de fevereiro de 2024
      //R$ 46.366,19 a partir de 1º de fevereiro de 2025

      calculator.teto =
        calculator.vencimentoBasico +
          calculator.gaj +
          calculator.aqeValue +
          calculator.aqfcValue +
          calculator.representacao <=
        41845.49
          ? 0
          : calculator.vencimentoBasico +
            calculator.gaj +
            calculator.aqeValue +
            calculator.aqfcValue +
            calculator.representacao -
            41845.49

      //Cálculo do desconto de previdência sobre salário
      calculator.previdencia =
        calculator.tipoPrevidencia === 'prevcom' || calculator.tipoPrevidencia === 'igeprevNovo'
          ? this.calcularPrevidencia(tetoIgeprev)
          : (calculator.vencimentoBasico + calculator.gaj + calculator.aqeValue) * 0.14

      //Cálculo do desconto da previdência complementar
      calculator.prevcom =
        calculator.vencimentoBasico + calculator.gaj + calculator.aqeValue >= tetoIgeprev
          ? (calculator.vencimentoBasico + calculator.gaj + calculator.aqeValue - tetoIgeprev) *
            0.085
          : 0

      //Cálculo da base de cálculo do IRRF
      const baseIRRF =
        calculator.tipoPrevidencia === 'prevcom'
          ? calculator.vencimentoBasico +
            calculator.gaj +
            calculator.aqeValue +
            calculator.aqfcValue +
            calculator.representacao +
            calculator.ferias -
            (calculator.previdencia +
              calculator.teto +
              calculator.prevcom +
              189.59 * calculator.dependente)
          : calculator.tipoPrevidencia === 'igeprevNovo'
            ? calculator.vencimentoBasico +
              calculator.gaj +
              calculator.aqeValue +
              calculator.aqfcValue +
              calculator.representacao +
              calculator.ferias -
              (calculator.previdencia + calculator.teto + 189.59 * calculator.dependente)
            : calculator.vencimentoBasico +
              calculator.gaj +
              calculator.aqeValue +
              calculator.aqfcValue +
              calculator.representacao +
              calculator.ferias -
              (calculator.previdencia + calculator.teto + 189.59 * calculator.dependente)

      /* console.log(`------------------------
      Vencimento Basico: ${calculator.vencimentoBasico}
      GAJ: ${calculator.gaj}
      AQE: ${calculator.aqeValue}
      AQFC: ${calculator.aqfcValue}
      Representacao: ${calculator.representacao}
      Previdencia: ${calculator.previdencia}
      Dependente: ${calculator.dependente}
      Previdencia: ${calculator.previdencia}
      Prevcom: ${calculator.prevcom}
      Base de Calculo IRRF: ${baseIRRF}
      TETO: ${calculator.teto}
      ------------------------`) */

      calculator.irrf = this.calcularIrrf(baseIRRF)
      calculator.totalDescontos =
        calculator.tipoPrevidencia === 'prevcom'
          ? calculator.previdencia +
            calculator.irrf +
            calculator.teto +
            calculator.prevcom +
            (parseFloat(calculator.outrosDescontos) || 0)
          : calculator.previdencia +
            calculator.irrf +
            calculator.teto +
            (parseFloat(calculator.outrosDescontos) || 0)

      calculator.salarioLiquido = calculator.salarioBruto - calculator.totalDescontos
    },

    percentualTetoSaude(reembolso) {
      return (reembolso * 100) / 3235.03
    },

    //Consulta reembolso por faixa etária
    consultaReembolso(faixaEtaria) {
      switch (faixaEtaria) {
        case '0-18':
          return 490.89
        case '19-23':
          return 610.72
        case '24-28':
          return 717.03
        case '29-33':
          return 876.41
        case '34-38':
          return 976.97
        case '39-43':
          return 1017.53
        case '44-48':
          return 1202.81
        case '49-53':
          return 1405.36
        case '54-58':
          return 1671.8
        case '59+':
          return 6267.39
      }
    },

    consultaValorFuncao(funcao) {
      switch (funcao) {
        case 'DAJ-1':
          return 4647.45 * 0.65
        case 'DAJ-2':
          return 5467.61 * 0.65
        case 'DAJ-3':
          return 6834.49 * 0.65
        case 'DAJ-4':
          return 8201.44 * 0.65
        case 'DAJ-5':
          return 10596.73 * 0.65
        case 'DAJ-6':
          return 16402.8 * 0.65
        case 'DAJ-7':
          return 19136.62 * 0.65
        case 'DAJ-8':
          return 23237.34 * 0.65
        case 'DAJ-9':
          return 26813.58 * 0.65
        case 'DAJ-10':
          return 29494.76 * 0.65
        case 'DAJ-11':
          return 31787.81 * 0.65
        case 'FC-1':
          return 1987.76
        case 'FC-2':
          return 2311.29
        case 'FC-3':
          return 2689.71
        case 'FC-4':
          return 3783.51
      }
    },

    calcularIrrf(baseCalculo) {
      if (baseCalculo <= 2428.8) {
        return 0
      } else if (baseCalculo <= 2826.65) {
        return (baseCalculo - 2428.8) * 0.075
      } else if (baseCalculo <= 3751.05) {
        return (baseCalculo - 2826.65) * 0.15 + 397.85 * 0.075
      } else if (baseCalculo <= 4664.68) {
        return (baseCalculo - 3751.05) * 0.225 + 924.4 * 0.15 + 397.85 * 0.075
      } else {
        return (baseCalculo - 4664.68) * 0.275 + 913.63 * 0.225 + 924.4 * 0.15 + 397.85 * 0.075
      }
    },

    calcularPrevidencia(baseDeCalculo) {
      return baseDeCalculo * 0.14
    },
    //Formatação de moeda para Real Brasileiro
    formatarParaBR(valor) {
      return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    },
  },
  //Remoção de opções de AQE inexistentes para 'Analista Judiciario'
  watch: {
    calculators: {
      deep: true,
      handler(newCalculators) {
        newCalculators.forEach((calculator) => {
          const validOptions = this.getAqeOptions(calculator.cargo)
          if (!validOptions.includes(calculator.aqe)) {
            calculator.aqe = 0
          }
        })
        // 🔐 New logic: Save to localStorage
        localStorage.setItem('calculators-store', JSON.stringify(newCalculators))
      },
    },
  },

  mounted() {
    const saved = localStorage.getItem('calculators-store')
    if (saved) {
      this.calculators = JSON.parse(saved)
    } else {
      this.calculators = [this.createCalculator(), this.createCalculator()]
    }

    this.calculators.forEach((_, index) => this.updateSalary(index))
  },
}
</script>

<style>
/* === DARK THEME === */
body[data-bs-theme='dark'] {
  .calculators {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
  }

  .calculator {
    flex: 1;
    margin-bottom: 1em;
    padding: 2em;
    border-radius: 1.5em;
    background-color: #212529;
    box-shadow: 0 0px 30px 0px rgba(30, 25, 49, 0.99);
    width: 100%;
  }

  @media (min-width: 600px) {
    .calculator {
      width: calc(50% - 20px);
    }
  }

  .title {
    text-wrap: balance;
    font-weight: 700;
    font-family: 'YourHeadingFont', sans-serif;
    line-height: 0.95;
    margin-bottom: 1rem;
    letter-spacing: -0.05em;
    font-size: 3rem;
  }

  .subtitle {
    font-family: 'YourHeadingFont', sans-serif;
    line-height: 1.25;
    margin-bottom: 1rem;
    font-size: 1.25rem;
  }

  @media (min-width: 768px) {
    .title {
      font-size: 3rem;
    }
  }

  .callout {
    padding: 15px;
    margin: 20px 0;
    border: 1px solid transparent;
    border-left-width: 10px;
    border-radius: 4px;
  }

  .callout-info {
    background-color: #212529;
    border-left-color: #15884c;
    color: #d1d1d1;
  }

  .callout-warning {
    background-color: #e1f1ff;
    border-left-color: #0f558f;
    color: #030303;
  }

  .tab-rendimento {
    background-image: linear-gradient(to left, rgba(255, 0, 0, 0) 15%, rgba(49, 71, 78, 0.5));
    margin-bottom: 1px;
    padding: 0.2em;
    padding-left: 0.5em;
    border-radius: 0.3em;
  }

  .tab-alimentacao {
    background-image: linear-gradient(to left, rgba(255, 0, 0, 0) 15%, rgba(29, 121, 111, 0.5));
    padding: 0.2em;
    padding-left: 0.5em;
    border-radius: 0.3em;
    margin-bottom: 1px;
  }

  .tab-representacao {
    background-image: linear-gradient(to left, rgba(255, 0, 0, 0) 15%, rgba(124, 79, 49, 0.5));
    padding: 0.2em;
    padding-left: 0.5em;
    border-radius: 0.3em;
    margin-bottom: 1px;
  }

  .tab-ferias {
    background-image: linear-gradient(to left, rgba(255, 0, 0, 0) 15%, rgba(59, 35, 97, 0.5));
    padding: 0.2em;
    padding-left: 0.5em;
    border-radius: 0.3em;
    margin-bottom: 1px;
  }

  .tab-saude {
    background-image: linear-gradient(to left, rgba(255, 0, 0, 0) 15%, rgba(134, 102, 14, 0.5));
    padding: 0.2em;
    padding-left: 0.5em;
    border-radius: 0.3em;
    margin-bottom: 1px;
  }

  .tab-decimo {
    background-image: linear-gradient(to left, rgba(255, 0, 0, 0) 15%, rgba(48, 71, 112, 0.5));
    padding: 0.2em;
    padding-left: 0.5em;
    border-radius: 0.3em;
    margin-bottom: 1px;
  }

  .tab-bruto {
    background-color: #214574;
    padding: 0.2em;
    padding-left: 0.5em;
    border-radius: 0.3em;
    color: white;
    font-weight: bold;
  }

  .tab-desconto {
    background-image: linear-gradient(to left, rgba(255, 0, 0, 0) 15%, rgba(105, 52, 52, 0.5));
    padding: 0.2em;
    padding-left: 0.5em;
    border-radius: 0.3em;
    margin-bottom: 1px;
  }

  .tab-desconto-total {
    background-color: #4d1818;
    padding: 0.2em;
    padding-left: 0.5em;
    border-radius: 0.3em;
    font-weight: bold;
  }

  .tab-liquido {
    margin-top: 1em;
    background-color: rgb(37, 87, 37);
    padding: 0.2em;
    padding-left: 0.5em;
    border-radius: 0.3em;
    font-weight: bold;
  }

  .tab-salario-e-decimo {
    margin-top: 1em;
    background-color: rgb(20, 133, 58);
    padding: 0.2em;
    border-radius: 0.3em;
    font-weight: bold;
    color: white;
  }

  .positive {
    color: rgb(48, 170, 48);
  }

  .negative {
    color: red;
  }

  .footer {
    color: #858585;
    margin-top: 3em;
    line-height: 1;
    text-align: justify;
    font-size: 0.9em;
  }

  .copyright {
    color: #858585;
    margin-top: 1em;
    line-height: 1;
    text-align: center;
    font-size: 0.9em;
  }

  .link {
    color: #c5c5c5;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-family: Arial, sans-serif;
    font-size: 14px;
    color: #353535;
  }

  .vue-logo {
    height: 20px;
    width: 20px;
    display: inline-block;
  }

  .clearBtn {
    background-color: #292929;
    color: white;
    border: none;
  }

  .clearBtn:hover {
    background-color: #414141;
  }

  .swapBtn {
    background-color: #2a1e4e;
    color: white;
    border: none;
  }

  .swapBtn:hover {
    background-color: #473285;
  }

  .copyBtn {
    background-color: #383053;
    color: white;
    border: none;
  }

  .copyBtn:hover {
    background-color: #564c77;
  }
}

/* === LIGHT THEME === */
body[data-bs-theme='light'] {
  .calculators {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
  }

  .calculator {
    flex: 1;
    margin-bottom: 1em;
    padding: 2em;
    border-radius: 1.5em;
    background-color: white;
    box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
    width: 100%;
  }

  @media (min-width: 600px) {
    .calculator {
      width: calc(50% - 20px);
    }
  }

  .title {
    font-weight: 700;
    font-family: 'YourHeadingFont', sans-serif;
    line-height: 0.95;
    margin-bottom: 1rem;
    letter-spacing: -0.05em;
    font-size: 3rem;
  }

  .subtitle {
    font-family: 'YourHeadingFont', sans-serif;
    line-height: 1.25;
    margin-bottom: 1rem;
    font-size: 1.25rem;
  }

  @media (min-width: 768px) {
    .title {
      font-size: 3rem;
    }
  }

  .callout {
    padding: 15px;
    margin: 20px 0;
    border: 1px solid transparent;
    border-left-width: 10px;
    border-radius: 4px;
  }

  .callout-info {
    background-color: #deebe5;
    border-left-color: #0a924e;
    color: #0c5460;
  }

  .callout-warning {
    background-color: #e1f1ff;
    border-left-color: #0f558f;
    color: #030303;
  }

  .tab-rendimento {
    background-image: linear-gradient(to left, rgba(255, 0, 0, 0), rgb(149, 213, 233));
    margin-bottom: 1px;
    padding: 0.2em;
    padding-left: 0.5em;
    border-radius: 0.3em;
  }

  .tab-alimentacao {
    background-image: linear-gradient(to left, rgba(255, 0, 0, 0), rgb(48, 199, 184));
    padding: 0.2em;
    padding-left: 0.5em;
    border-radius: 0.3em;
    margin-bottom: 1px;
  }

  .tab-representacao {
    background-image: linear-gradient(to left, rgba(255, 0, 0, 0), rgb(248, 175, 127));
    padding: 0.2em;
    padding-left: 0.5em;
    border-radius: 0.3em;
    margin-bottom: 1px;
  }

  .tab-ferias {
    background-image: linear-gradient(to left, rgba(255, 0, 0, 0), rgb(216, 191, 255));
    padding: 0.2em;
    padding-left: 0.5em;
    border-radius: 0.3em;
    margin-bottom: 1px;
  }

  .tab-saude {
    background-image: linear-gradient(to left, rgba(255, 0, 0, 0), rgb(241, 203, 97));
    padding: 0.2em;
    padding-left: 0.5em;
    border-radius: 0.3em;
    margin-bottom: 1px;
  }

  .tab-decimo {
    background-image: linear-gradient(to left, rgba(255, 0, 0, 0), rgb(180, 206, 255));
    padding: 0.2em;
    padding-left: 0.5em;
    border-radius: 0.3em;
    margin-bottom: 1px;
  }

  .tab-bruto {
    background-color: #214574;
    padding: 0.2em;
    padding-left: 0.5em;
    border-radius: 0.3em;
    color: white;
    font-weight: bold;
  }

  .tab-desconto {
    background-image: linear-gradient(to left, rgba(255, 0, 0, 0), rgb(255, 200, 200));
    padding: 0.2em;
    padding-left: 0.5em;
    border-radius: 0.3em;
    margin-bottom: 1px;
  }

  .tab-desconto-total {
    background-color: #ff9393;
    padding: 0.2em;
    padding-left: 0.5em;
    border-radius: 0.3em;
    font-weight: bold;
  }

  .tab-liquido {
    margin-top: 1em;
    background-color: rgb(102, 214, 102);
    padding: 0.2em;
    padding-left: 0.5em;
    border-radius: 0.3em;
    font-weight: bold;
  }

  .tab-salario-e-decimo {
    margin-top: 1em;
    background-color: rgb(20, 133, 58);
    padding: 0.2em;
    border-radius: 0.3em;
    font-weight: bold;
    color: white;
  }

  .positive {
    color: green;
  }

  .negative {
    color: red;
  }

  .footer {
    color: #383838;
    margin-top: 3em;
    line-height: 1;
    text-align: justify;
    font-size: 0.9em;
  }

  .copyright {
    color: #383838;
    margin-top: 1em;
    line-height: 1;
    text-align: center;
    font-size: 0.9em;
  }

  .link {
    color: rgb(71, 71, 71);
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-family: Arial, sans-serif;
    font-size: 14px;
    color: #353535;
  }

  .vue-logo {
    height: 20px;
    width: 20px;
    display: inline-block;
  }

  .clearBtn {
    background-color: #4f8ec2;
    color: white;
    border: none;
  }

  .clearBtn:hover {
    background-color: #77a3c5;
  }

  .swapBtn {
    background-color: #193963;
    color: white;
    border: none;
  }

  .swapBtn:hover {
    background-color: #30598d;
  }

  .copyBtn {
    background-color: #486ea0;
    color: white;
    border: none;
  }

  .copyBtn:hover {
    background-color: #6284af;
  }
}

.gradient-text {
  background: linear-gradient(to right, #302055, rgb(147, 104, 172), rgb(67, 9, 161));
  background-size: 200% 200%;
  animation: rainbow 4s ease-in-out infinite;
  background-clip: text;
  -webkit-background-clip: text;
  color: rgb(109 40 217);
  transition: color 0.2s ease-in-out;
  font-weight: 900;
}

.gradient-text {
  color: rgba(0, 0, 0, 0);
}

@keyframes rainbow {
  0% {
    background-position: left;
  }

  50% {
    background-position: right;
  }

  100% {
    background-position: left;
  }
}
</style>
