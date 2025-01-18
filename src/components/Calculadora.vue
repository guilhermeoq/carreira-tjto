<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary navbar-collapse">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">🚀 Simulador TJTO</a>
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
            <a
              class="nav-link"
              href="https://sapl.al.to.leg.br/media/sapl/public/normajuridica/2024/923/lei_4435-2024.pdf"
              >Data-base</a
            >
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              href="https://www.tjto.jus.br/component/edocman/685-plano-de-cargos-carreiras-e-remuneracao-dos-servidores-do-tjto/viewdocument/685?Itemid="
              >PCCR</a
            >
          </li>
          <li class="nav-item">
            <a class="nav-link" href="https://sapl.al.to.leg.br/materia/9605">URV PL06/2023</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <div id="app" class="container-lg">
    <div style="padding-top: 2em" class="container-sm">
      <h1 class="title">
        Simulador de Salário do
        <span class="gradient-text">PCCR</span> dos Servidores do TJTO
      </h1>
      <p class="subtitle">
        Este simulador é <strong>gratuito, não coleta nenhuma informação pessoal</strong> e foi
        desenvolvido com base em dados do Portal da Transparência e da legislação vigente.
      </p>
      <div class="callout callout-info">
        <strong>📢 Novidades: </strong>Informar dependentes do IR, calcular adicional de férias, 13º
        salário e auxílio saúde (com verificação de consumo dos limites por faixa etária e geral).
      </div>
    </div>
    <div class="d-sm-flex gap-3">
      <div v-for="(calculator, index) in calculators" :key="index" class="calculator">
        <h4>Simulação {{ index + 1 }}</h4>
        <form @change="updateSalary(index)">
          <!-- SWITCH URV -->
          <div class="form-check form-switch mt-4 mb-3">
            <input
              v-model="calculator.simularURV"
              class="form-check-input"
              type="checkbox"
              role="switch"
              id="URVSwitch"
            />
            <label class="form-check-label" for="URVSwitch"
              >Simular URV de 11,98% (PL 06/2023)
            </label>
          </div>
          <div class="d-flex justify-content-center gap-3">
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
              <label for="cargoSelect">Cargo</label>
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
              <label for="nivel">Nível</label>
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
              <label for="aqfc">AQFC</label>
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
              <label for="aqe">AQE</label>
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
            <label for="dependente">Nº dep. IR</label>
          </div>

          <div class="form-check form-switch mb-3">
            <input
              v-model="calculator.switchFerias"
              class="form-check-input"
              type="checkbox"
              role="switch"
              id="ferias"
            />
            <label class="form-check-label" for="ferias">Adicional de Férias</label>
          </div>

          <!-- SELECTION AUXILIO SAUDE -->
          <div class="border-top">
            <div class="mt-3 form-check form-switch mb-3">
              <input
                v-model="calculator.switchSaude"
                class="form-check-input"
                type="checkbox"
                role="switch"
                id="switchSaude"
              />
              <label class="form-check-label" for="switchSaude">Auxílio Saúde</label>
            </div>

            <!-- Faixa Etaria - Idade Servidor -->
            <div class="d-flex flex-wrap justify-content-between gap-1">
              <div v-if="calculator.switchSaude" class="form-floating mb-1 flex-fill col-3">
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
                <label for="idadeServidor">Idade Servidor</label>
              </div>
              <div v-if="calculator.switchSaude" class="form-floating mb-1 col-6">
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
                <label for="mensalidadeServidor">Valor Servidor (R$)</label>
              </div>
            </div>
            <div
              v-if="calculator.switchSaude"
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
              v-if="calculator.switchSaude"
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
                <label for="idadeDependente1">Idade Dep. 1</label>
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
                <label for="mensalidadeDependente1">Valor Dep. 1 (R$)</label>
              </div>
            </div>
            <div
              v-if="calculator.switchSaude"
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
              v-if="calculator.switchSaude"
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
                <label for="idadeDependente2">Idade Dep. 2</label>
              </div>
              <div v-show="calculator.switchSaude" class="form-floating mb-3 col-6">
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
                <label for="mensalidadeDependente2">Valor Dep. 2 (R$)</label>
              </div>
            </div>
            <div
              v-if="calculator.switchSaude"
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
              v-if="calculator.switchSaude"
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
                <label for="idadeDependente3">Idade Dep. 3+</label>
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
                <label for="mensalidadeDependente3">Valor Dep. 3 (R$)</label>
              </div>
            </div>
            <div
              v-if="calculator.switchSaude"
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

            <div v-if="calculator.switchSaude" class="input-group mb-3 flex-fill">
              <label class="input-group-text" for="multiplicador">Multiplicar 'Dep. 3' x</label>
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
            <div v-if="calculator.switchSaude" class="progress-stacked border-bottom">
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

          <div v-if="calculator.switchSaude" class="d-flex flex-wrap justify-content-center">
            <p>
              <small><strong>Teto Aux. Saúde: R$ 3.235,03</strong></small>
            </p>
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
                <label class="form-check-label" for="decimo">13º Salário </label>
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
                <label class="form-check-label" for="integral"> Integral </label>
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
                <label class="form-check-label" for="parcela1"> 1ª Parcela </label>
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
                <label class="form-check-label" for="parcela2"> 2ª Parcela </label>
              </div>
            </div>
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
            <strong><i class="bi bi-people-fill"></i> Previdência:</strong>
            {{ formatarParaBR(calculator.previdencia) }}
          </p>
          <p class="tab-desconto">
            <strong><i class="bi bi-bank2"></i> IRRF:</strong> {{ formatarParaBR(calculator.irrf) }}
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
            class="tab-decimo-desconto"
          >
            <strong><i class="bi bi-receipt"></i> Adiantamento 13º:</strong>
            {{ formatarParaBR(calculator.decimoAdiantamento) }}
          </p>
          <p class="tab-decimo-desconto">
            <strong><i class="bi bi-people-fill"></i> Previdência do 13º:</strong>
            {{ formatarParaBR(calculator.decimoPrevidencia) }}
          </p>
          <p class="tab-decimo-desconto">
            <strong><i class="bi bi-bank2"></i> IRRF do 13º:</strong>
            {{ formatarParaBR(calculator.decimoIRRF) }}
          </p>
          <p class="tab-decimo-desconto-total">
            <i class="bi bi-caret-down-fill"></i> Total de Descontos 13º:
            {{ formatarParaBR(calculator.totalDescontosDecimo) }}
          </p>
          <p class="tab-decimo-liquido">
            <i class="bi bi-caret-right-fill"></i> 13º Salário Líquido:
            {{ formatarParaBR(calculator.decimoLiquido) }}
          </p>
          <p class="tab-salario-e-decimo">
            <i class="bi bi-caret-right-fill"></i> Total Líquido (Salário + 13º):
            {{ formatarParaBR(calculator.decimoLiquido + calculator.salarioLiquido) }}
          </p>
        </div>
      </div>
    </div>
    <h5 style="text-align: center; margin-top: 1em; margin-bottom: 1em">
      Comparativo (diferença de valor líquido):
      <span :class="{ positive: salaryDifference > 0, negative: salaryDifference < 0 }">
        {{ formatarParaBR(salaryDifference) }}</span
      >
    </h5>
    <div class="container d-flex justify-content-center align-items-center">
      <p class="footer">
        Desenvolvido por
        <a
          href="https://beacons.ai/guilhermeoq"
          target="_blank"
          rel="noopener noreferrer"
          class="link-dark badge-link"
          >Guilherme Quintino <i class="bi bi-box-arrow-up-right"></i></a
        >. Os valores calculados nesta página não podem ser considerados 100% corretos devido a
        possíveis erros nos cálculos e nos valores e alíquotas de impostos e gratificações. Não me
        responsabilizo por eventuais diferenças entre a simulação e os valores reais.
      </p>
    </div>

    <div class="badge container d-flex justify-content-center align-items-center gap-3">
      <a href="https://vuejs.org" target="_blank" rel="noopener noreferrer" class="badge-link">
        <span>Powered by</span>
        <img src="https://vuejs.org/images/logo.png" alt="Vue Logo" class="vue-logo" />
        <span>Vue.js</span>
      </a>
      <a
        href="https://github.com/guilhermeoq/carreira-tjto-vue"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="https://img.shields.io/badge/Available%20on%20GitHub-100000?style=flat&logo=github&logoColor=white"
          alt="Disponível no GitHub"
        />
      </a>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      calculators: [this.createCalculator(), this.createCalculator()],
    }
  },
  computed: {
    salaryDifference() {
      if (this.calculators[0].switchDecimo && this.calculators[1].switchDecimo)
        return (
          this.calculators[1].salarioLiquido +
          this.calculators[1].decimoLiquido -
          (this.calculators[0].salarioLiquido + this.calculators[0].decimoLiquido)
        )
      else if (this.calculators[0].switchDecimo)
        return (
          this.calculators[1].salarioLiquido -
          (this.calculators[0].salarioLiquido + this.calculators[0].decimoLiquido)
        )
      else if (this.calculators[1].switchDecimo)
        return (
          this.calculators[1].salarioLiquido +
          this.calculators[1].decimoLiquido -
          this.calculators[0].salarioLiquido
        )
      else return this.calculators[1].salarioLiquido - this.calculators[0].salarioLiquido
    },
  },
  methods: {
    //Inicializar calculadora
    createCalculator() {
      return {
        simularURV: false,
        switchSaude: false,
        cargo: 'tecnico',
        nivel: 1,
        aqfc: 3,
        aqe: 7.5,
        dependente: 0,
        ferias: 0,
        saude: 0,
        faixaEtariaServidor: '0-18',
        faixaEtariaDependente1: '0-18',
        faixaEtariaDependente2: '0-18',
        faixaEtariaDependente3: '0-18',
        multiplicadorDependente3: 1,
        mensalidadeServidor: '',
        mensalidadeDependente1: '',
        mensalidadeDependente2: '',
        mensalidadeDependente3: '',
        percentualSaudeServidor: 0,
        percentualSaudeDep1: 0,
        percentualSaudeDep2: 0,
        percentualSaudeDep3: 0,
        decimoparcela1: 0,
        decimoAdiantamento: 0,
        decimoFolhaComplementar: 0,
        decimoPrevidencia: 0,
        decimoIRRF: 0,
        decimoLiquido: 0,
        tipoDecimo: 'integral',
        vencimentoBasico: 0,
        gaj: 0,
        aqfcValue: 0,
        aqeValue: 0,
        salarioBruto: 0,
        previdencia: 0,
        irrf: 0,
        totalDescontos: 0,
        salarioLiquido: 0,
        totalDescontosDecimo: 0,
      }
    },
    //Opções de AQE conforme cargo
    getAqeOptions(cargo) {
      if (cargo === 'analista') {
        return [0, 7.5, 10.5, 12.5]
      }
      return [0, 5, 7.5, 10.5, 12.5]
    },
    //Atualizar cálculo do salário
    updateSalary(index) {
      const calculator = this.calculators[index]
      const salarios = {
        tecnico: [
          7140.42, 7497.44, 7872.31, 8265.92, 8679.22, 9113.17, 9568.85, 10047.27, 10549.66,
          11077.11, 11630.98, 12212.54, 12823.16, 13464.32, 14137.55,
        ],
        analista: [
          11954.45, 12552.18, 13179.8, 13838.77, 14530.7, 15257.24, 16020.1, 16821.11, 17662.11,
          18545.29, 19472.54, 20446.16, 21468.48, 22541.9, 23669.0,
        ],
      }

      const vb = salarios[calculator.cargo][calculator.nivel - 1]
      calculator.vencimentoBasico = calculator.simularURV ? vb * 1.1198 : vb
      calculator.gaj = calculator.vencimentoBasico * 0.3
      calculator.aqfcValue = calculator.vencimentoBasico * (calculator.aqfc / 100)
      calculator.aqeValue = calculator.vencimentoBasico * (calculator.aqe / 100)
      calculator.ferias = calculator.switchFerias
        ? (calculator.vencimentoBasico +
            calculator.gaj +
            calculator.aqfcValue +
            calculator.aqeValue) /
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
        //console.log('----------------')
        //console.log('Auxilio Servidor: ' + auxilioServidor)

        // Consulta teto de reembolso Aux.Saude para Dependente 1
        if (
          calculator.mensalidadeDependente1 >=
          this.consultaReembolso(calculator.faixaEtariaDependente1)
        )
          auxilioDependente1 = this.consultaReembolso(calculator.faixaEtariaDependente1)
        else auxilioDependente1 = calculator.mensalidadeDependente1
        //console.log('Auxilio Dependente 1: ' + auxilioDependente1)

        // Consulta teto de reembolso Aux.Saude para Dependente 2
        if (
          calculator.mensalidadeDependente2 >=
          this.consultaReembolso(calculator.faixaEtariaDependente2)
        )
          auxilioDependente2 = this.consultaReembolso(calculator.faixaEtariaDependente2)
        else auxilioDependente2 = calculator.mensalidadeDependente2
        //console.log('Auxilio Dependente 2: ' + auxilioDependente2)

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
            // console.log(
            //   'Auxilio Dependente 3 x ' +
            //     calculator.multiplicadorDependente3 +
            //     '= ' +
            //     auxilioDependente3,
            // )

            //Somatório dos reembolsos apurados conforme tetos por faixa etária
            (reembolsoAgregado = parseFloat(
              auxilioServidor + auxilioDependente1 + auxilioDependente2 + auxilioDependente3,
            ))
        calculator.saude = reembolsoAgregado >= 3235.03 ? 3235.03 : reembolsoAgregado

        calculator.percentualSaudeServidor = this.percentualTetoSaude(auxilioServidor)
        calculator.percentualSaudeDep1 = this.percentualTetoSaude(auxilioDependente1)
        calculator.percentualSaudeDep2 = this.percentualTetoSaude(auxilioDependente2)
        calculator.percentualSaudeDep3 = this.percentualTetoSaude(auxilioDependente3)
        //console.log('PERCENTUAIS: ')
        //console.log('Servidor: ' + calculator.percentualSaudeServidor)
        //console.log('Dep1: ' + calculator.percentualSaudeDep1)
        //console.log('Dep2: ' + calculator.percentualSaudeDep2)
        //console.log('Dep3: ' + calculator.percentualSaudeDep3)
      } else calculator.saude = 0.0

      //Cálculo do 13º salário integral - incluso em folha complementar
      calculator.decimoFolhaComplementar =
        calculator.switchDecimo &&
        (calculator.tipoDecimo === 'integral' || calculator.tipoDecimo === 'parcela2')
          ? calculator.vencimentoBasico +
            calculator.gaj +
            calculator.aqfcValue +
            calculator.aqeValue
          : 0

      //Cálculo da 1ª parcela do 13º salário - incluso em folha normal
      calculator.decimoparcela1 =
        calculator.switchDecimo && calculator.tipoDecimo === 'parcela1'
          ? (calculator.vencimentoBasico +
              calculator.gaj +
              calculator.aqfcValue +
              calculator.aqeValue) /
            2
          : 0

      //Cálculo do desconto de adiantamento da 1ª parcela do 13º salário
      calculator.decimoAdiantamento = calculator.decimoFolhaComplementar / 2

      calculator.decimoPrevidencia =
        calculator.switchDecimo &&
        (calculator.tipoDecimo === 'integral' || calculator.tipoDecimo === 'parcela2')
          ? (calculator.vencimentoBasico + calculator.gaj + calculator.aqeValue) * 0.14
          : calculator.switchDecimo && calculator.tipoDecimo === 'parcela1'
            ? 0
            : 0

      //Cálculo do IRRF sobre o 13º salário
      calculator.decimoIRRF = this.calcularIrrf(calculator.decimoFolhaComplementar)

      const baseIRRFDecimo =
        calculator.vencimentoBasico +
        calculator.gaj +
        calculator.aqeValue +
        calculator.aqfcValue -
        (calculator.decimoPrevidencia + 189.59 * calculator.dependente)
      calculator.decimoIRRF = this.calcularIrrf(baseIRRFDecimo)

      //Total de descontos aplicados sobre o 13º salário
      calculator.totalDescontosDecimo =
        calculator.switchDecimo && calculator.tipoDecimo === 'integral'
          ? calculator.decimoPrevidencia + calculator.decimoIRRF
          : calculator.switchDecimo && calculator.tipoDecimo === 'parcela2'
            ? calculator.decimoAdiantamento + calculator.decimoPrevidencia + calculator.decimoIRRF
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
        calculator.ferias +
        calculator.saude +
        calculator.decimoparcela1 +
        2122

      //Cálculo do desconto de previdência sobre salário
      calculator.previdencia =
        (calculator.vencimentoBasico + calculator.gaj + calculator.aqeValue) * 0.14

      //Cálculo da base de cálculo do IRRF
      const baseIRRF =
        calculator.vencimentoBasico +
        calculator.gaj +
        calculator.aqeValue +
        calculator.aqfcValue +
        calculator.ferias -
        (calculator.previdencia + 189.59 * calculator.dependente)
      calculator.irrf = this.calcularIrrf(baseIRRF)
      calculator.totalDescontos = calculator.previdencia + calculator.irrf
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

    calcularIrrf(baseCalculo) {
      if (baseCalculo <= 2259.2) {
        return 0
      } else if (baseCalculo <= 2826.65) {
        return (baseCalculo - 2259.2) * 0.075
      } else if (baseCalculo <= 3751.05) {
        return (baseCalculo - 2826.65) * 0.15 + 567.45 * 0.075
      } else if (baseCalculo <= 4664.68) {
        return (baseCalculo - 3751.05) * 0.225 + 924.4 * 0.15 + 567.45 * 0.075
      } else {
        return (baseCalculo - 4664.68) * 0.275 + 913.63 * 0.225 + 924.4 * 0.15 + 567.45 * 0.075
      }
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
      },
    },
  },

  mounted() {
    this.calculators.forEach((_, index) => this.updateSalary(index))
  },
}
</script>

<style scoped>
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
  color: #1f1f1f;
  font-size: 3rem;
}

.subtitle {
  font-family: 'YourHeadingFont', sans-serif;
  line-height: 1.25;
  margin-bottom: 1rem;
  color: #1f1f1f;
  font-size: 1.25rem;
}

@media (min-width: 768px) {
  .title {
    font-size: 3rem;
  }
}

.gradient-text {
  background: linear-gradient(to right, #e27318, rgb(27, 194, 130), rgb(109 40 217));
  background-size: 200% 200%;
  animation: rainbow 2s ease-in-out infinite;
  background-clip: text;
  -webkit-background-clip: text;
  color: rgb(109 40 217);
  transition: color 0.2s ease-in-out;
  font-weight: 900;
}
.gradient-text:hover {
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

.callout {
  padding: 15px;
  margin: 20px 0;
  border: 1px solid transparent;
  border-left-width: 5px;
  border-radius: 4px;
}

.callout-info {
  background-color: #d1f1d4;
  border-left-color: #0a924e;
  color: #0c5460;
}

.tab-rendimento {
  background-color: lightblue;
  margin-bottom: 1px;
  padding: 0.5em;
  border-radius: 0.5em;
}

.tab-alimentacao {
  background-color: #80c5bf;
  padding: 0.5em;
  border-radius: 0.5em;
  margin-bottom: 1px;
}

.tab-ferias {
  background-color: #a9b8e9;
  padding: 0.5em;
  border-radius: 0.5em;
  margin-bottom: 1px;
}

.tab-saude {
  background-color: #dbb03a;
  padding: 0.5em;
  border-radius: 0.5em;
  margin-bottom: 1px;
}

.tab-decimo {
  background-color: #cdc8ff;
  padding: 0.5em;
  border-radius: 0.5em;
  margin-bottom: 1px;
}

.tab-bruto {
  background-color: #1f5d72;
  padding: 0.5em;
  border-radius: 0.5em;
  color: white;
  font-weight: bold;
  border-radius: 0.5em;
}

.tab-desconto {
  background-color: #ffc8c8;
  padding: 0.5em;
  border-radius: 0.5em;
  margin-bottom: 1px;
}

.tab-desconto-total {
  background-color: #ff9393;
  padding: 0.5em;
  border-radius: 0.5em;
  font-weight: bold;
}

.tab-liquido {
  margin-top: 1em;
  background-color: lightgreen;
  padding: 0.5em;
  border-radius: 0.5em;
  font-weight: bold;
}

.tab-decimo-desconto {
  background-color: #ffc8c8;
  padding: 0.5em;
  border-radius: 0.5em;
  margin-bottom: 1px;
}

.tab-decimo-desconto-total {
  background-color: #ff9393;
  padding: 0.5em;
  border-radius: 0.5em;
  font-weight: bold;
}

.tab-decimo-liquido {
  margin-top: 1em;
  background-color: #b7b0ff;
  padding: 0.5em;
  border-radius: 0.5em;
  font-weight: bold;
}

.tab-salario-e-decimo {
  margin-top: 1em;
  background-color: rgb(36, 36, 36);
  padding: 0.5em;
  border-radius: 0.5em;
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
  margin-top: 1em;
  line-height: 1;
  text-align: justify;
  font-size: 0.9em;
}

.badge {
  margin-top: 1em;
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

.badge-link {
  text-decoration: none;
  color: inherit;
}

.badge-link:hover {
  color: #42b883;
}
</style>
