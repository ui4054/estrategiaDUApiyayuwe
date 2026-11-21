/**
 * ============================================================================
 * SIMULATORS.JS — Motores Interactivos y Simuladores Reactivos (Módulos 1, 2 y 3)
 * Proyecto: ¡Aguas con el mosquito! — Institución Educativa Las Guacas (Corinto, Cauca)
 * Patrón Arquitectónico de 3 Capas Desacopladas:
 *   - CAPA 1: Funciones matemáticas, físicas y de evaluación puras (determinísticas)
 *   - CAPA 2: Actualización reactiva del DOM y Chart.js con `chart.update('none')` a 60 FPS
 *   - CAPA 3: Binding de eventos con debounce/RAF y soporte completo de accesibilidad DUA
 * ============================================================================
 */

(function () {
  'use strict';

  /* ==========================================================================
   * UTILIDADES TRANSVERSALES (DEBOUNCE Y PALETA DE TEMA PARA CHART.JS)
   * ========================================================================== */

  function debounce(fn, waitMs) {
    let timeoutId = null;
    return function (...args) {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        fn.apply(this, args);
      }, waitMs);
    };
  }

  function getThemeChartColors() {
    const isDark =
      document.documentElement.getAttribute('data-theme') === 'dark' ||
      document.body.classList.contains('dark-theme');
    return {
      textColor: isDark ? '#f4ede2' : '#2b2118',
      mutedColor: isDark ? '#c7b8a3' : '#5c4938',
      gridColor: isDark ? 'rgba(244, 237, 226, 0.14)' : 'rgba(43, 33, 24, 0.12)',
      dangerColor: '#d90429',
      dangerFill: isDark ? 'rgba(217, 4, 41, 0.25)' : 'rgba(217, 4, 41, 0.16)',
      successColor: '#38b000',
      successFill: isDark ? 'rgba(56, 176, 0, 0.25)' : 'rgba(56, 176, 0, 0.16)',
      accentPrimary: '#d47e30',
      accentSecondary: '#2a9d8f',
      accentTertiary: '#6a4c93'
    };
  }

  /* ==========================================================================
   * CAPA 1: FUNCIONES MATEMÁTICAS, FÍSICAS Y DE ESTADO PURAS
   * ========================================================================== */

  /**
   * 1.1. MÓDULO 1 — Evaluación pura del Juego "Armando las 3 Escenas en Tonga"
   */
  function evaluateTeatroScenesPure(selectedValues, selectedRole) {
    const expectedOrder = ['1', '2', '3'];
    const normalized = selectedValues.map((v) => {
      const str = String(v || '').trim().toLowerCase();
      if (str.includes('1') || str.includes('inicio') || str.includes('criadero') || str.includes('estancada')) return '1';
      if (str.includes('2') || str.includes('nudo') || str.includes('cadena') || str.includes('picadura') || str.includes('fiebre')) return '2';
      if (str.includes('3') || str.includes('desenlace') || str.includes('tonga') || str.includes('accion') || str.includes('acción') || str.includes('prevencion')) return '3';
      return str;
    });

    let hits = 0;
    for (let i = 0; i < expectedOrder.length; i++) {
      if (normalized[i] === expectedOrder[i]) hits++;
    }

    const isComplete = normalized.every((v) => v === '1' || v === '2' || v === '3');
    const hasDuplicates = new Set(normalized).size !== normalized.length;
    const isCorrect = hits === 3 && !hasDuplicates;

    const roleFeedbackMap = {
      lider: {
        tituloRol: '🌿 Consejo para Líder de Tonga',
        mision: 'Coordina la transición entre el nacimiento de larvas en el tanque destapado (Escena 1), la cadena de picaduras y fiebre (Escena 2) y la minga preventiva escolar-familiar (Escena 3).'
      },
      materiales: {
        tituloRol: '🛠️ Consejo para Guardián/a de Materiales',
        mision: 'Alista el balde sin tapa para la Escena 1, las alas con patas rayadas del Aedes aegypti y el termómetro para la Escena 2, y la cubierta impermeable con aro ajustado para la Escena 3.'
      },
      registrador: {
        tituloRol: '📐 Consejo para Registrador/a Científico/a',
        mision: 'Verifica que el guion mencione los 7 a 10 días del ciclo acuático del mosquito en la Escena 1, los signos de alarma sin automedicación en la Escena 2 y la reducción del riesgo en la Escena 3.'
      },
      relator: {
        tituloRol: '📣 Consejo para Relator/a Comunitario/a',
        mision: 'Narra con fuerza expresiva cómo el virus NO pasa de persona a persona por el aire, sino cuando la hembra Aedes aegypti pica a alguien con dengue y luego a otra persona.'
      }
    };

    const roleKey = String(selectedRole || 'lider').toLowerCase();
    let matchedRole = roleFeedbackMap.lider;
    if (roleKey.includes('material') || roleKey.includes('guardian') || roleKey === '2') {
      matchedRole = roleFeedbackMap.materiales;
    } else if (roleKey.includes('registra') || roleKey.includes('cientifico') || roleKey === '3') {
      matchedRole = roleFeedbackMap.registrador;
    } else if (roleKey.includes('relator') || roleKey.includes('comunica') || roleKey === '4') {
      matchedRole = roleFeedbackMap.relator;
    }

    return {
      hits,
      isComplete,
      hasDuplicates,
      isCorrect,
      roleInfo: matchedRole
    };
  }

  /**
   * 1.2. MÓDULO 1 — Modelo matemático puro de Transmisión Epidemiológica del Dengue a 14 días
   * Basado en tasa vectorial modulada por recipientes destapados, temperatura en el Cauca y cobertura de la Tonga.
   */
  function computeDengueTransmissionPure(inputs) {
    const recipientes = Math.max(0, Number(inputs.recipientes) || 0); // 0..20
    const temp = Number(inputs.temperatura) || 28; // 18..36 °C
    const cobertura = Math.min(100, Math.max(0, Number(inputs.cobertura) || 0)); // 0..100 %

    // Factor térmico entomológico (óptimo de reproducción del Aedes aegypti entre 26°C y 32°C)
    const thermalFactor = Math.max(0.2, 1 - Math.pow((temp - 29.5) / 11, 2));
    // Tasa de crecimiento intrínseco sin prevención
    const rBase = 0.08 + (recipientes / 20) * 0.28 * thermalFactor;
    // Reducción lograda por la acción colectiva de la Tonga (tapado, cepillado y control larvario)
    const efficacyFactor = 1 - (cobertura / 100) * 0.88;
    const rTonga = Math.max(0.015, rBase * efficacyFactor);

    const capacidadMaxima = 120;
    const casosIniciales = Math.max(1, Math.round(1 + recipientes * 0.25));

    const labels = [];
    const serieSinPrevencion = [];
    const serieConTonga = [];

    for (let dia = 1; dia <= 14; dia++) {
      labels.push('Día ' + dia);
      const t = dia - 1;

      // Curva logística discreta sin prevención
      const ySin =
        (capacidadMaxima * casosIniciales * Math.exp(rBase * t)) /
        (capacidadMaxima + casosIniciales * (Math.exp(rBase * t) - 1));

      // Curva con intervención de la Tonga (frena la pendiente desde el día 2)
      const yCon =
        (capacidadMaxima * casosIniciales * Math.exp(rTonga * t * 0.72)) /
        (capacidadMaxima + casosIniciales * (Math.exp(rTonga * t * 0.72) - 1));

      serieSinPrevencion.push(Number(ySin.toFixed(1)));
      serieConTonga.push(Number(Math.min(ySin, yCon).toFixed(1)));
    }

    const dia14Sin = serieSinPrevencion[13];
    const dia14Con = serieConTonga[13];
    const casosEvitados = Math.max(0, Math.round(dia14Sin - dia14Con));

    // Índice de riesgo neto con la intervención actual (0..100)
    const indiceRiesgo = Math.min(
      100,
      Math.max(0, Math.round((recipientes * 4.2 * thermalFactor) * (1 - (cobertura / 100) * 0.82)))
    );

    let nivelRiesgo = 'Bajo (Controlado en Tonga)';
    let claseBadge = 'badge-success';
    if (indiceRiesgo >= 60) {
      nivelRiesgo = 'Alto (Alerta Epidemiológica)';
      claseBadge = 'badge-danger';
    } else if (indiceRiesgo >= 30) {
      nivelRiesgo = 'Moderado (Vigilancia Activa)';
      claseBadge = 'badge-warning';
    }

    return {
      labels,
      serieSinPrevencion,
      serieConTonga,
      dia14Sin,
      dia14Con,
      casosEvitados,
      indiceRiesgo,
      nivelRiesgo,
      claseBadge
    };
  }

  /**
   * 2.1. MÓDULO 2 — Modelo físico puro de Ascenso Capilar: h(t) = h_max * (1 - e^(-k * t))
   * Datos oficiales del Excel:
   *   - Papel absorbente: x̄ = 4.5 cm (mediciones: 4.5, 5.0, 4.0)
   *   - Tela de algodón : x̄ = 6.0 cm (mediciones: 6.0, 6.5, 5.5)
   *   - Plástico PET    : x̄ = 0.0 cm (mediciones: 0.0, 0.0, 0.0)
   */
  function computeCapilaridadPhysicsPure(tiempoSeg, maxTimesSeg, customAverages) {
    const t = Math.max(0, Number(tiempoSeg) || 0);
    const tMax = Math.max(10, Number(maxTimesSeg) || 60);

    const hMaxPapel = customAverages && typeof customAverages.avgPapel === 'number' ? customAverages.avgPapel : 4.5;
    const hMaxTela = customAverages && typeof customAverages.avgTela === 'number' ? customAverages.avgTela : 6.0;
    const hMaxPlastico = customAverages && typeof customAverages.avgPlastico === 'number' ? customAverages.avgPlastico : 0.0;

    // Constantes de velocidad capilar k ajustadas para alcanzar ~98% de h_max al finalizar el protocolo tMax
    const kPapel = 4.2 / tMax;
    const kTela = 3.8 / tMax;
    const kPlastico = 0.0;

    const hPapelNow = Number((hMaxPapel * (1 - Math.exp(-kPapel * t))).toFixed(2));
    const hTelaNow = Number((hMaxTela * (1 - Math.exp(-kTela * t))).toFixed(2));
    const hPlasticoNow = Number((hMaxPlastico * (1 - Math.exp(-kPlastico * t))).toFixed(2));

    // Generar curva temporal completa (0 a tMax en 13 puntos) por si el gráfico muestra series o barras
    const timeLabels = [];
    const curvePapel = [];
    const curveTela = [];
    const curvePlastico = [];
    const steps = 12;
    for (let i = 0; i <= steps; i++) {
      const ti = Math.round((tMax / steps) * i);
      timeLabels.push(ti + ' s');
      curvePapel.push(Number((hMaxPapel * (1 - Math.exp(-kPapel * ti))).toFixed(2)));
      curveTela.push(Number((hMaxTela * (1 - Math.exp(-kTela * ti))).toFixed(2)));
      curvePlastico.push(Number((hMaxPlastico * (1 - Math.exp(-kPlastico * ti))).toFixed(2)));
    }

    return {
      t,
      tMax,
      hMaxPapel,
      hMaxTela,
      hMaxPlastico,
      hPapelNow,
      hTelaNow,
      hPlasticoNow,
      timeLabels,
      curvePapel,
      curveTela,
      curvePlastico
    };
  }

  /**
   * 2.2. MÓDULO 2 — Cálculo puro de Medias Aritméticas de la Hoja de Registro DUA
   */
  function computeLabAveragesPure(measurements) {
    function mean3(arr) {
      const nums = arr.map((n) => {
        const parsed = parseFloat(n);
        return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
      });
      const sum = nums[0] + nums[1] + nums[2];
      return Number((sum / 3).toFixed(2));
    }

    const avgPapel = mean3(measurements.papel);
    const avgTela = mean3(measurements.tela);
    const avgPlastico = mean3(measurements.plastico);
    const avgGeneral = Number(((avgPapel + avgTela + avgPlastico) / 3).toFixed(2));

    return {
      avgPapel,
      avgTela,
      avgPlastico,
      avgGeneral
    };
  }

  /**
   * 2.3. MÓDULO 2 — Evaluación pura del Constructor de Cubierta y Trampa (`#trampaBuilder`)
   */
  function evaluateTrampaPrototypePure(material, ajusteBorde, tipoTrampa) {
    const mat = String(material || '').toLowerCase();
    const borde = String(ajusteBorde || '').toLowerCase();
    const trampa = String(tipoTrampa || '').toLowerCase();

    let scoreMaterial = 20;
    let razonMaterial = '';
    if (mat.includes('plastico') || mat.includes('plástico') || mat.includes('pet') || mat.includes('impermeable')) {
      scoreMaterial = 45;
      razonMaterial = 'El plástico PET tiene capilaridad 0.0 cm (impermeable): no se empapa ni se rompe con la lluvia y bloquea al 100% el paso de la hembra Aedes aegypti.';
    } else if (mat.includes('malla') || mat.includes('tul') || mat.includes('combinad') || mat.includes('hibrid')) {
      scoreMaterial = 40;
      razonMaterial = 'La malla milimétrica combinada con borde plástico impide la entrada del mosquito adulto y permite ventilación siempre que no toque el nivel del agua.';
    } else if (mat.includes('tela') || mat.includes('algodon') || mat.includes('algodón')) {
      scoreMaterial = 22;
      razonMaterial = 'La tela de algodón absorbió 6.0 cm de agua en el laboratorio: si toca el agua o llueve, se mantiene húmeda y puede ceder o permitir postura de huevos en los bordes húmedos.';
    } else if (mat.includes('papel') || mat.includes('carton') || mat.includes('cartón')) {
      scoreMaterial = 10;
      razonMaterial = 'El papel absorbió 4.5 cm de agua por capilaridad y pierde resistencia estructural al mojarse, dejando fisuras abiertas al mosquito.';
    } else {
      scoreMaterial = 35;
      razonMaterial = 'Material evaluado según su impermeabilidad y resistencia a la intemperie.';
    }

    let scoreBorde = 10;
    let razonBorde = '';
    if (borde.includes('caucho') || borde.includes('elastico') || borde.includes('elástico') || borde.includes('aro') || borde.includes('hermetico') || borde.includes('hermético') || borde.includes('cuerda')) {
      scoreBorde = 35;
      razonBorde = 'El sellado perimetral con aro/caucho tensado elimina rendijas laterales (el mosquito solo necesita 2 mm para entrar).';
    } else if (borde.includes('piedra') || borde.includes('peso') || borde.includes('sobrepuest') || borde.includes('parcial')) {
      scoreBorde = 20;
      razonBorde = 'El borde sobrepuesto con peso deja pliegues por donde la hembra Aedes aegypti puede infiltrarse buscando sombra y humedad.';
    } else {
      scoreBorde = 10;
      razonBorde = 'Sin ajuste en el borde, el viento o el uso diario destapan el recipiente.';
    }

    let scoreTrampa = 5;
    let razonTrampa = '';
    if (trampa.includes('ovitrampa') || trampa.includes('embudo') || trampa.includes('cepilla') || trampa.includes('control') || trampa.includes('doble')) {
      scoreTrampa = 20;
      razonTrampa = 'El complemento con cepillado semanal de paredes internas y trampa de captura interrumpe el ciclo de huevos adheridos.';
    } else if (trampa.includes('visual') || trampa.includes('revision') || trampa.includes('revisión') || trampa.includes('basica') || trampa.includes('básica')) {
      scoreTrampa = 14;
      razonTrampa = 'La inspección visual ayuda, pero recuerda cepillar las paredes del tanque donde los huevos resisten secos hasta por meses.';
    } else {
      scoreTrampa = 6;
      razonTrampa = 'Se recomienda añadir limpieza de paredes internas o trampa complementaria para alcanzar protección integral.';
    }

    const totalScore = Math.min(100, Math.max(5, scoreMaterial + scoreBorde + scoreTrampa));

    let nivel = 'Prototipo Vulnerable — Requiere Rediseño en Tonga';
    let estadoClase = 'status-danger';
    if (totalScore >= 85) {
      nivel = '¡Prototipo Óptimo Validado por la Tonga! (Barrera Segura)';
      estadoClase = 'status-success';
    } else if (totalScore >= 60) {
      nivel = 'Prototipo Funcional Parcial — Ajustar Borde o Material';
      estadoClase = 'status-warning';
    }

    return {
      totalScore,
      nivel,
      estadoClase,
      diagnostico: `${razonMaterial} ${razonBorde} ${razonTrampa}`
    };
  }

  /**
   * 3.1. MÓDULO 3 — Generador de MODELO DE INFOGRAFÍA ALEATORIO según Canal, Enfoque Cultural y Saber Familiar
   */
  let lastRandomVariantIdx = -1;

  function pickRandomVariant(totalVariants) {
    if (totalVariants <= 1) return 0;
    let idx = Math.floor(Math.random() * totalVariants);
    if (idx === lastRandomVariantIdx) {
      idx = (idx + 1) % totalVariants;
    }
    lastRandomVariantIdx = idx;
    return idx;
  }

  function buildInfographicSVG(canalKey, themeKey, variantIdx) {
    const palettes = {
      afro: { bg: '#1c1917', c1: '#f59e0b', c2: '#0284c7', c3: '#fde68a', label: 'TONGA AFROCAUCANA · UBUNTU (GUACHENÉ & UNIÓN DEL SALADO)' },
      nasa: { bg: '#231111', c1: '#ef4444', c2: '#22c55e', c3: '#fecaca', label: 'TEJIDO DEL CHUMBE NASA · GUARDIA DE UMA KIWE' },
      cafetera: { bg: '#231512', c1: '#22c55e', c2: '#d97706', c3: '#fef3c7', label: 'PAISAJE CULTURAL CAFETERO · COSECHA DE AGUA LIMPIA' }
    };
    const p = palettes[themeKey] || palettes.afro;

    // Motivo cultural decorativo izquierdo según enfoque
    let motifSVG = '';
    if (themeKey === 'nasa') {
      motifSVG = `
        <g transform="translate(28, 42)">
          <polygon points="55,5 100,50 55,95 10,50" fill="none" stroke="${p.c1}" stroke-width="4"/>
          <polygon points="55,22 83,50 55,78 27,50" fill="${p.c2}" opacity="0.85"/>
          <circle cx="55" cy="50" r="8" fill="#fde047"/>
          <text x="55" y="118" text-anchor="middle" fill="${p.c3}" font-size="11" font-family="Outfit, sans-serif" font-weight="bold">CHUMBE NASA</text>
        </g>`;
    } else if (themeKey === 'cafetera') {
      motifSVG = `
        <g transform="translate(28, 42)">
          <path d="M10,85 L42,30 L68,68 L90,38 L112,85 Z" fill="${p.c1}" opacity="0.85"/>
          <circle cx="42" cy="82" r="9" fill="#dc2626"/>
          <circle cx="65" cy="84" r="9" fill="#b91c1c"/>
          <ellipse cx="88" cy="82" rx="8" ry="11" fill="#78350f" stroke="${p.c3}" stroke-width="1.5"/>
          <text x="60" y="118" text-anchor="middle" fill="${p.c3}" font-size="11" font-family="Outfit, sans-serif" font-weight="bold">FINCA CAFETERA</text>
        </g>`;
    } else {
      motifSVG = `
        <g transform="translate(28, 42)">
          <circle cx="55" cy="46" r="28" fill="${p.c1}" opacity="0.9"/>
          <path d="M12,82 Q35,66 55,82 T98,82" fill="none" stroke="${p.c2}" stroke-width="4"/>
          <path d="M12,94 Q35,78 55,94 T98,94" fill="none" stroke="#38bdf8" stroke-width="3"/>
          <text x="55" y="118" text-anchor="middle" fill="${p.c3}" font-size="11" font-family="Outfit, sans-serif" font-weight="bold">SOL Y RÍO UBUNTU</text>
        </g>`;
    }

    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 185" width="100%" height="100%" style="border-radius:10px; display:block;">
        <rect width="760" height="185" rx="10" fill="${p.bg}"/>
        <rect x="0" y="0" width="253" height="6" fill="${p.c1}"/>
        <rect x="253" y="0" width="254" height="6" fill="${p.c2}"/>
        <rect x="507" y="0" width="253" height="6" fill="${p.c3}"/>
        <text x="380" y="25" text-anchor="middle" fill="${p.c3}" font-family="Outfit, sans-serif" font-size="12" font-weight="bold">
          MODELO VISUAL DE INFOGRAFÍA DUA #${variantIdx + 1} · ${p.label}
        </text>
        ${motifSVG}
        <!-- Gráfica comparativa de las 3 tiras del laboratorio -->
        <g transform="translate(170, 42)">
          <rect x="0" y="0" width="340" height="122" rx="8" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.15)"/>
          <text x="170" y="18" text-anchor="middle" fill="#ffffff" font-family="Outfit, sans-serif" font-size="11" font-weight="bold">EVIDENCIA EXPERIMENTAL DE CAPILARIDAD (2 × 10 cm)</text>
          <!-- Barra Papel 4.5 cm -->
          <text x="14" y="46" fill="#e5e7eb" font-size="11" font-family="Inter, sans-serif">Papel (4.5 cm)</text>
          <rect x="125" y="35" width="112" height="14" rx="4" fill="#38bdf8"/>
          <text x="245" y="46" fill="#bae6fd" font-size="10" font-family="Inter, sans-serif">Permeable</text>
          <!-- Barra Tela 6.0 cm -->
          <text x="14" y="74" fill="#e5e7eb" font-size="11" font-family="Inter, sans-serif">Tela (6.0 cm)</text>
          <rect x="125" y="63" width="150" height="14" rx="4" fill="#f59e0b"/>
          <text x="282" y="74" fill="#fde68a" font-size="10" font-family="Inter, sans-serif">Absorbente</text>
          <!-- Barra Plástico PET 0.0 cm -->
          <text x="14" y="102" fill="#86efac" font-size="11" font-family="Inter, sans-serif" font-weight="bold">Plástico (0.0 cm)</text>
          <rect x="125" y="91" width="8" height="14" rx="3" fill="#22c55e"/>
          <text x="142" y="102" fill="#86efac" font-size="10" font-family="Inter, sans-serif" font-weight="bold">¡IMPERMEABLE · SELLO IDEAL!</text>
        </g>
        <!-- Sello de Cubierta Hermética -->
        <g transform="translate(530, 42)">
          <rect x="0" y="0" width="205" height="122" rx="8" fill="rgba(34,197,94,0.14)" stroke="${p.c2}" stroke-width="1.5"/>
          <circle cx="102" cy="42" r="22" fill="none" stroke="#86efac" stroke-width="2.5"/>
          <path d="M92,42 L100,50 L115,34" fill="none" stroke="#86efac" stroke-width="3"/>
          <text x="102" y="82" text-anchor="middle" fill="#ffffff" font-family="Outfit, sans-serif" font-size="11" font-weight="bold">BARRERA 100% SELLADA</text>
          <text x="102" y="100" text-anchor="middle" fill="${p.c3}" font-family="Inter, sans-serif" font-size="10">Canal: ${canalKey.toUpperCase()} · Semilla #${variantIdx + 1}</text>
        </g>
      </svg>`;
  }

  function generateMultimodalMessagePure(canal, identidad, saberFamiliar, forceNewRandom) {
    const canalKey = String(canal || 'copla').toLowerCase();
    const idKey = String(identidad || 'afro').toLowerCase();
    const saberLimpio = (saberFamiliar || '').trim() ||
      'Tapar la caneca con plástico grueso y caucho de neumático, cepillando las paredes cada semana.';

    let themeKey = 'afro';
    if (idKey.includes('nasa') || idKey.includes('indigena') || idKey.includes('indígena')) {
      themeKey = 'nasa';
    } else if (idKey.includes('cafe') || idKey.includes('campesin')) {
      themeKey = 'cafetera';
    }

    const culturalConfigs = {
      afro: {
        nombre: 'Afrocaucano · Guachené y La Unión del Salado (Tonga & Ubuntu)',
        territorio: 'Guachené y La Unión del Salado',
        icono: 'fa-drum',
        lemaUbuntu: 'Ubuntu: «Yo soy porque nosotros somos»',
        hooks: [
          '¡Al golpe de la marimba y el cununo, en nuestra Tonga no queda criadero alguno!',
          '¡Oigan familias del río y del sol: con ciencia y tradición cuidamos la salud hoy!',
          '¡Juntando las manos en Tonga aprendemos que el agua bien tapada es vida para el pueblo!',
          '¡Que suene el bombo en el patio escolar: a la zancuda Aedes no la dejamos entrar!'
        ],
        coplas: [
          'En Guachené y El Salado medimos con precisión:\npapel cuatro punto cinco ($4.5\\text{ cm}$) y seis ($6.0\\text{ cm}$) el algodón;\npero el plástico dio cero ($0.0\\text{ cm}$) en toda repetición,\n¡con cubierta bien sellada salvamos a la región!',
          'Cuatro roles en la Tonga trabajan con hermandad:\ncronómetro, regla y tabla nos muestran la realidad.\nEl plástico es impermeable, cero humedad dejó entrar,\n¡y con el saber de casa el tanque vamos a asegurar!',
          'La hembra del zancudo busca agua limpia para criar,\ny si pica a un infectado el dengue puede pasar.\nPor eso en comunidad aplicamos la lección:\n¡tapa plástica sin huecos y cero automedicación!',
          'Soy porque nosotros somos, dice el principio ancestral,\ncuidar el agua del barrio es tarea primordial.\nTres muestras por material comprobamos en el salón:\n¡plástico PET con buen caucho es nuestra mejor solución!'
        ]
      },
      nasa: {
        nombre: 'Pueblo Indígena Nasa · Tejido del Chumbe y Guardia de Uma Kiwe',
        territorio: 'Territorio Nasa del Norte del Cauca',
        icono: 'fa-Mountain-sun',
        lemaUbuntu: 'Wët Wët Fxiʼzenxi: «Buen vivir en armonía con Uma Kiwe»',
        hooks: [
          '¡Maʼwẽ uʼjwe! Como los hilos del Chumbe, tejemos ciencia y saber mayor para cuidar el agua (Yuʼ).',
          '¡Al son de la flauta y el tambor, la niñez investigadora protege el agua de cada tul y hogar!',
          '¡En minga y Tonga escolar defendemos la salud del territorio frente al vector del dengue!',
          '¡La geometría del Chumbe nos enseña orden y exactitud: cero aberturas en nuestros recipientes!'
        ],
        coplas: [
          'En las montañas del Cauca cuidamos el agua pura,\ntejemos como en la jigra una cubierta segura.\nPapel ($4.5\\text{ cm}$) y tela ($6.0\\text{ cm}$) dejan el agua subir,\n¡pero el plástico en $0.0\\text{ cm}$ impide al vector vivir!',
          'Nueve datos en la tabla registramos con rigor,\ncalculando tres promedios como buen investigador.\nEl saber de nuestros mayores hoy se une al laboratorio:\n¡recipientes bien sellados en todo nuestro territorio!',
          'Si el mosquito infectado pica de día en el hogar,\nla fiebre a toda la casa muy pronto puede llegar.\nCon regla táctil y ciencia comprobamos la verdad:\n¡cubierta plástica firme protege a la comunidad!',
          'Cuidar a Uma Kiwe empieza por el agua del fogón,\nque ningún tanque destapado quede nunca en el rincón.\nCon el consejo en familia y la prueba experimental,\n¡cerramos el paso al dengue de manera comunal!'
        ]
      },
      cafetera: {
        nombre: 'Cultura Campesina y Cafetera · Cosecha de Agua y Convite Veredal',
        territorio: 'Veredas Cafeteras y Zona Rural Caucana',
        icono: 'fa-mug-hot',
        lemaUbuntu: 'Convite Campesino: «Agua cuidada en la finca, salud para toda la vereda»',
        hooks: [
          '¡Entre cafetales y guayacanes, en nuestra finca tapamos tanques, canecas y gavilanes!',
          '¡Como el buen café pergamino seleccionado con rigor, así medimos en 4.º grado para frenar al vector!',
          '¡Oiga vecino cafetero: el agua limpia de la alberca se cuida con tapa plástica de cero absorción!',
          '¡Al compás de la trova andina y la ciencia escolar, en esta vereda el dengue no va a germinar!'
        ],
        coplas: [
          'En la finca cafetera guardamos agua bendita,\ny con ciencia en cuarto grado toda la Tonga se alista.\nLa tela subió a seis ($6.0\\text{ cm}$) y el papel a cuatro y medio ($4.5\\text{ cm}$),\n¡pero el plástico en $0.0\\text{ cm}$ nos dio el mejor remedio!',
          'Cuando llueve en el cafetal recogemos agua clara,\npero si queda destapada la zancuda se prepara.\nPor eso con tres medidas sacamos el promedio exacto:\n¡cubierta de plástico PET ajustada con buen contacto!',
          'En el corredor de casa conversamos con papá,\ny trajimos al colegio la experiencia familiar.\nSumando tres mediciones y dividiendo entre tres,\n¡comprobamos que el plástico protege el agua otra vez!',
          'Que brille el grano maduro y cante el trabajador,\ncon los tanques bien sellados no hay criadero ni vector.\nSi hay fiebre vamos al puesto de salud sin demorar,\n¡porque en convite y en Tonga sabemos bien prevenir y actuar!'
        ]
      }
    };

    const cult = culturalConfigs[themeKey];
    const variantIdx = forceNewRandom ? pickRandomVariant(4) : (lastRandomVariantIdx >= 0 ? lastRandomVariantIdx : pickRandomVariant(4));
    const hookText = cult.hooks[variantIdx % cult.hooks.length];
    const coplaText = cult.coplas[variantIdx % cult.coplas.length];

    const channelLayouts = {
      copla: {
        badge: '🎵 INFOGRAFÍA CANCIONERO / COPLA RÍTMICA',
        q1Title: '1. Alerta Epidemiológica (Verso & Vector)',
        q1Body: 'La hembra infectada de <em>Aedes aegypti</em> transmite el virus por picadura diurna y deposita sus huevos en paredes de recipientes con agua limpia destapada.',
        q2Title: '2. Copla Científica Generada (Semilla #' + (variantIdx + 1) + ')',
        q2Body: `<blockquote style="margin:0; font-style:italic; white-space:pre-line; border-left:3px solid var(--afro-gold); padding-left:0.65rem;">${coplaText}</blockquote>`,
        q3Title: '3. Evidencia Cuantitativa de la Tonga',
        q3Body: 'Media de 3 muestras ($2 \\times 10\\text{ cm}$): Papel $\\bar{x}=4.5\\text{ cm}$ (Permeable), Tela $\\bar{x}=6.0\\text{ cm}$ (Muy absorbente), Plástico PET $\\bar{x}=0.0\\text{ cm}$ (Impermeable).',
        q4Title: '4. Saber Familiar Integrado en Casa',
        q4Body: `<strong>Práctica del hogar:</strong> «${saberLimpio}»<br><em>Opciones DUA:</em> Canto coral, lectura asistida, percusión corporal o pictogramas.`
      },
      infografia: {
        badge: '📊 AFICHE INFOGRÁFICO CIENTÍFICO (4 CUADRANTES DUA)',
        q1Title: 'Cuadrante I · Cadena de Transmisión OMS',
        q1Body: '<strong>Vector → Picadura → Brote Familiar:</strong> Sin criaderos en agua almacenada se interrumpe el ciclo reproductivo del mosquito.',
        q2Title: 'Cuadrante II · Datos del Laboratorio Escolar',
        q2Body: 'Fórmula aplicada: $\\bar{x} = \\frac{x_1+x_2+x_3}{3}$. El Plástico PET registró $0.0\\text{ cm}$ de ascenso capilar frente a $3.5\\text{ cm}$ del promedio general.',
        q3Title: 'Cuadrante III · Ingeniería de la Cubierta',
        q3Body: `<strong>Diseño de cierre hermético:</strong> Cubierta impermeable ajustada al borde sin aberturas visibles. <em>Verso visual:</em> ${coplaText.split('\n')[0]}`,
        q4Title: 'Cuadrante IV · Diálogo de Saberes Familiares',
        q4Body: `<strong>Consejo de la familia (${cult.territorio}):</strong> «${saberLimpio}» · Accesible con macrotipo, alto contraste y regla táctil.`
      },
      feria: {
        badge: '🎪 PENDÓN INFOGRÁFICO PARA STAND EN FERIA DE CIENCIAS',
        q1Title: 'Estación 1 (Observador) · El Problema Local',
        q1Body: 'Demostración de cómo un recipiente sin tapa se convierte en criadero y por qué el control del tiempo ($30\\text{ s} / 120\\text{ s}$) garantiza pruebas justas.',
        q2Title: 'Estación 2 (Medidor y Registrador) · Pruebas',
        q2Body: 'Exhibición de las tiras reales de Papel ($4.5\\text{ cm}$), Tela ($6.0\\text{ cm}$) y Plástico PET ($0.0\\text{ cm}$) medidas con regla graduada táctil DUA.',
        q3Title: 'Estación 3 (Ingeniería) · Prototipo de Cubierta',
        q3Body: 'Prueba en vivo del sellado hermético sobre el recipiente vacío y explicación de trampas físicas, visuales y acústicas.',
        q4Title: 'Estación 4 (Vocero) · Saber Familiar y Cierre',
        q4Body: `<strong>Aporte de nuestros hogares:</strong> «${saberLimpio}».<br><em>Lema de cierre:</em> ${cult.lemaUbuntu}.`
      },
      reportaje: {
        badge: '🎙️ INFOGRAFÍA GUION GRÁFICO / REPORTAJE COMUNITARIO',
        q1Title: 'Viñeta 1 (00:00 - 00:15) · Cortinilla Sonora',
        q1Body: `<strong>Apertura intercultural:</strong> ${hookText} Explicación clara de la transmisión por picadura del mosquito infectado.`,
        q2Title: 'Viñeta 2 (00:15 - 00:35) · Cápsula de Laboratorio',
        q2Body: 'Entrevista al equipo de 4.º grado: comparamos 9 mediciones y 3 promedios ($\\text{Papel } 4.5\\text{ cm}, \\text{Tela } 6.0\\text{ cm}, \\text{Plástico } 0.0\\text{ cm}$).',
        q3Title: 'Viñeta 3 (00:35 - 00:50) · Voz de la Familia',
        q3Body: `<strong>Relato desde el hogar en ${cult.territorio}:</strong> «${saberLimpio}». Contraste entre saber tradicional y prueba experimental.`,
        q4Title: 'Viñeta 4 (00:50 - 01:00) · Compromiso Preventivo',
        q4Body: 'Llamado a revisar y sellar tanques cada semana sin aberturas visibles y recoger el comentario familiar en casa.'
      },
      tiktok: {
        badge: '📱 INFOGRAFÍA STORYBOARD TIKTOKER EDUCATIVO (60s)',
        q1Title: 'Escena 1 (0-15s) · Gancho Visual Rápido',
        q1Body: `<strong>En cámara:</strong> «¿Sabías que una sola abertura en tu caneca basta para el mosquito del dengue?» · ${hookText}`,
        q2Title: 'Escena 2 (15-35s) · Reto de las 3 Tiras',
        q2Body: '<em>Time-lapse</em> sumergiendo $1\\text{ cm}$ en agua: Tela sube a $6.0\\text{ cm}$, Papel a $4.5\\text{ cm}$ y Plástico PET queda en $0.0\\text{ cm}$ (¡Impermeable!).',
        q3Title: 'Escena 3 (35-50s) · Hack Familiar en Casa',
        q3Body: `<strong>Sabiduría de mi familia:</strong> «${saberLimpio}» aplicada al diseño de nuestra cubierta sin ranuras.`,
        q4Title: 'Escena 4 (50-60s) · Audio Viral & Copla',
        q4Body: `<span style="font-style:italic;">"${coplaText.split('\n').slice(2, 4).join(' / ')}"</span> · <strong>#TongaSinDengue #STEMCauca</strong>`
      }
    };

    let selectedChannelKey = 'copla';
    if (canalKey.includes('infografia')) selectedChannelKey = 'infografia';
    else if (canalKey.includes('feria')) selectedChannelKey = 'feria';
    else if (canalKey.includes('reportaje')) selectedChannelKey = 'reportaje';
    else if (canalKey.includes('tiktok')) selectedChannelKey = 'tiktok';

    const layout = channelLayouts[selectedChannelKey];
    const svgGraphic = buildInfographicSVG(selectedChannelKey, themeKey, variantIdx);

    return {
      tituloFormato: layout.badge,
      identidadLabel: cult.nombre,
      variantNumber: variantIdx + 1,
      cuerpoHTML: `
        <div class="infografia-poster theme-${themeKey}" id="posterInfografiaActiva">
          <div class="infografia-banner">
            <div>
              <div style="font-size:0.74rem; text-transform:uppercase; letter-spacing:0.06em; opacity:0.92;">
                ${layout.badge} · DISEÑO ALEATORIO #${variantIdx + 1}
              </div>
              <h4 id="infogHookTitle" style="margin:0.25rem 0; font-size:1.22rem;">${hookText}</h4>
              <div style="font-size:0.84rem; opacity:0.95;"><i class="fa-solid ${cult.icono}"></i> ${cult.nombre}</div>
            </div>
            <span id="infogSeedBadge" class="badge-stage" style="background:rgba(0,0,0,0.35); color:#fff; border-color:#fff;">
              Semilla Visual #${variantIdx + 1}/4
            </span>
          </div>

          <div class="infografia-grid">
            <div class="infografia-quadrant">
              <h5><i class="fa-solid fa-mosquito" style="color:var(--nasa-crimson);"></i> ${layout.q1Title}</h5>
              <div id="infogQ1Body" style="font-size:0.88rem;">${layout.q1Body}</div>
            </div>
            <div class="infografia-quadrant">
              <h5><i class="fa-solid fa-flask-vial" style="color:var(--afro-river);"></i> ${layout.q2Title}</h5>
              <div id="infogQ2Body" style="font-size:0.88rem;">${layout.q2Body}</div>
            </div>
            <div class="infografia-quadrant">
              <h5><i class="fa-solid fa-shield-halved" style="color:var(--nasa-emerald);"></i> ${layout.q3Title}</h5>
              <div id="infogQ3Body" style="font-size:0.88rem;">${layout.q3Body}</div>
            </div>
            <div class="infografia-quadrant">
              <h5><i class="fa-solid fa-house-chimney-user" style="color:var(--afro-gold);"></i> ${layout.q4Title}</h5>
              <div id="infogQ4Body" style="font-size:0.88rem;">${layout.q4Body}</div>
            </div>
          </div>

          <div class="infografia-svg-stage">
            ${svgGraphic}
          </div>

          <div class="infografia-footer-bar">
            <span><strong><i class="fa-solid fa-universal-access"></i> Accesibilidad DUA:</strong> Contenido valorado por su rigor científico y vínculo familiar (Pautas 5.1 y 5.2).</span>
            <span id="infogFooterLema"><strong>${cult.lemaUbuntu}</strong></span>
          </div>
        </div>
      `
    };
  }

  /**
   * 3.2. MÓDULO 3 — Evaluación pura de la Calculadora de Rúbrica Formativa DUA (`#chartRubricaRadar`)
   */
  function computeRubricaDUAPure(scores, modalidad, hasApoyoDUA) {
    const cleanScores = scores.map((val) => {
      const n = parseFloat(val);
      return Number.isFinite(n) ? Math.min(5, Math.max(1, n)) : 3;
    });

    const sum = cleanScores.reduce((acc, curr) => acc + curr, 0);
    const promedio = Number((sum / cleanScores.length).toFixed(2));

    let nivelDesempeno = 'En Proceso / Básico (Requiere acompañamiento de la Tonga)';
    let badgeClass = 'badge-warning';
    let recomendacionPedagogica =
      'Se recomienda reforzar la conexión entre los datos medidos en el laboratorio (cm) y la explicación preventiva usando apoyos visuales o dramatización guiada.';

    if (promedio >= 4.2) {
      nivelDesempeno = 'Avanzado / Superior (Dominio Científico, Cooperativo y Comunitario)';
      badgeClass = 'badge-success';
      recomendacionPedagogica =
        '¡Excelente trabajo en Tonga! El estudiante o equipo articula con rigor el ciclo epidemiológico, la medición matemática de capilaridad y la divulgación intercultural.';
    } else if (promedio >= 3.2) {
      nivelDesempeno = 'Satisfactorio / Alto (Logro Consolidado con Oportunidad de Profundización)';
      badgeClass = 'badge-primary';
      recomendacionPedagogica =
        'El equipo comprende la prevención del dengue y realiza mediciones válidas; puede enriquecer su mensaje comunitario vinculando más explícitamente los promedios de laboratorio.';
    }

    const modalidadLabels = {
      oral: 'Sustentación Oral / Copla Cantada',
      visual: 'Infografía Pictórica / Mapa Visual',
      practica: 'Demostración Experimental con Prototipo',
      escrita: 'Bitácora Científica Escrita / Bimodal'
    };
    const modKey = String(modalidad || 'oral').toLowerCase();
    let modTexto = modalidadLabels.oral;
    if (modKey.includes('visual') || modKey.includes('infografia') || modKey.includes('pictograma')) {
      modTexto = modalidadLabels.visual;
    } else if (modKey.includes('practic') || modKey.includes('práctic') || modKey.includes('prototipo') || modKey.includes('maqueta')) {
      modTexto = modalidadLabels.practica;
    } else if (modKey.includes('escrit') || modKey.includes('bitacora') || modKey.includes('bitácora')) {
      modTexto = modalidadLabels.escrita;
    }

    const metaEsperada = hasApoyoDUA ? [4.0, 4.0, 4.0, 4.0, 4.0, 4.0] : [4.2, 4.2, 4.2, 4.2, 4.2, 4.2];

    return {
      cleanScores,
      promedio,
      nivelDesempeno,
      badgeClass,
      recomendacionPedagogica,
      modTexto,
      hasApoyoDUA: Boolean(hasApoyoDUA),
      metaEsperada
    };
  }

  /* ==========================================================================
   * CAPA 2: ACTUALIZACIÓN REACTIVA DEL DOM Y DE CHART.JS (`chart.update('none')`)
   * ========================================================================== */

  // Instancias de gráficos Chart.js
  let chartDengueInstance = null;
  let chartCapilaridadInstance = null;
  let chartRubricaInstance = null;

  /**
   * --------------------------------------------------------------------------
   * MÓDULO 1 — CAPA 2: Teatro Epidemiológico y Simulador de Transmisión
   * --------------------------------------------------------------------------
   */
  function updateTeatroGameDOM() {
    const selects = Array.from(document.querySelectorAll('.scene-order-select'));
    const rolSelect = document.getElementById('rolTeatroSelect');
    const feedbackEl = document.getElementById('teatroFeedback');
    if (!feedbackEl || selects.length === 0) return;

    const selectedValues = selects.map((s) => s.value);
    const selectedRole = rolSelect ? rolSelect.value : 'lider';
    const result = evaluateTeatroScenesPure(selectedValues, selectedRole);

    if (result.isCorrect) {
      feedbackEl.className = 'teatro-feedback-box feedback-success';
      feedbackEl.innerHTML = `
        <div class="feedback-header">
          <strong>✅ ¡Orden Dramático y Epidemiológico Correcto (3 de 3 escenas en secuencia)!</strong>
        </div>
        <p>
          <strong>Secuencia validada:</strong> 1.º Agua estancada y postura de huevos → 2.º Cadena vectorial de picaduras y alerta de fiebre (sin automedicación) → 3.º Acción colectiva de la Tonga tapando y cepillando tanques.
        </p>
        <div class="feedback-role-callout">
          <strong>${result.roleInfo.tituloRol}:</strong> ${result.roleInfo.mision}
        </div>
      `;
    } else if (result.hasDuplicates) {
      feedbackEl.className = 'teatro-feedback-box feedback-warning';
      feedbackEl.innerHTML = `
        <div class="feedback-header">
          <strong>⚠️ Hay números de escena repetidos (${result.hits} de 3 en su lugar)</strong>
        </div>
        <p>
          Asigna un orden único (<strong>1.ª, 2.ª y 3.ª escena</strong>) a cada momento de la historia para que la cadena epidemiológica tenga sentido causal.
        </p>
        <div class="feedback-role-callout">
          <strong>${result.roleInfo.tituloRol}:</strong> ${result.roleInfo.mision}
        </div>
      `;
    } else {
      feedbackEl.className = 'teatro-feedback-box feedback-error';
      feedbackEl.innerHTML = `
        <div class="feedback-header">
          <strong>🔄 Revisa la secuencia causal (${result.hits} de 3 escenas ubicadas correctamente)</strong>
        </div>
        <p>
          <em>Pista científica:</em> Primero debe existir el criadero en el recipiente destapado (Escena 1), luego ocurre la transmisión por la picadura del mosquito y aparece la fiebre (Escena 2), y finalmente la comunidad organiza la Tonga preventiva (Escena 3).
        </p>
        <div class="feedback-role-callout">
          <strong>${result.roleInfo.tituloRol}:</strong> ${result.roleInfo.mision}
        </div>
      `;
    }
  }

  function initOrUpdateDengueChart() {
    const canvas = document.getElementById('chartTransmisionDengue');
    const sliderRecipientes = document.getElementById('sliderRecipientesDestapados');
    const sliderTemp = document.getElementById('sliderTemperaturaCauca');
    const sliderCobertura = document.getElementById('sliderCoberturaTonga');

    if (!canvas && !sliderRecipientes) return;

    const inputs = {
      recipientes: sliderRecipientes ? parseFloat(sliderRecipientes.value) : 8,
      temperatura: sliderTemp ? parseFloat(sliderTemp.value) : 29,
      cobertura: sliderCobertura ? parseFloat(sliderCobertura.value) : 65
    };

    const model = computeDengueTransmissionPure(inputs);

    // Actualizar etiquetas del DOM
    const elValRecipientes = document.getElementById('valRecipientes');
    const elValTemp = document.getElementById('valTempCauca');
    const elValCobertura = document.getElementById('valCoberturaTonga');
    const elBadge = document.getElementById('riesgoDengueBadge');

    if (elValRecipientes) elValRecipientes.textContent = `${inputs.recipientes} recipientes`;
    if (elValTemp) elValTemp.textContent = `${inputs.temperatura} °C`;
    if (elValCobertura) elValCobertura.textContent = `${inputs.cobertura}%`;

    if (elBadge) {
      elBadge.textContent = `Riesgo ${model.nivelRiesgo} (${model.indiceRiesgo}/100) · Casos evitados a 14 días: ${model.casosEvitados}`;
      elBadge.className = `badge ${model.claseBadge}`;
    }

    if (!canvas || typeof window.Chart === 'undefined') return;

    const colors = getThemeChartColors();

    if (!chartDengueInstance) {
      const ctx = canvas.getContext('2d');
      chartDengueInstance = new window.Chart(ctx, {
        type: 'line',
        data: {
          labels: model.labels,
          datasets: [
            {
              label: 'Sin prevención (Tanques destapados)',
              data: model.serieSinPrevencion,
              borderColor: colors.dangerColor,
              backgroundColor: colors.dangerFill,
              borderWidth: 2.5,
              borderDash: [6, 4],
              pointRadius: 3,
              fill: true,
              tension: 0.35
            },
            {
              label: 'Con acción de la Tonga (Tapado y cepillado)',
              data: model.serieConTonga,
              borderColor: colors.successColor,
              backgroundColor: colors.successFill,
              borderWidth: 3,
              pointRadius: 4,
              fill: true,
              tension: 0.35
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
          interaction: {
            mode: 'index',
            intersect: false
          },
          plugins: {
            legend: {
              labels: {
                color: colors.textColor,
                font: { family: 'Inter, sans-serif', size: 12, weight: '600' }
              }
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  return `${context.dataset.label}: ${context.parsed.y} casos proyectados`;
                }
              }
            }
          },
          scales: {
            x: {
              ticks: { color: colors.mutedColor },
              grid: { color: colors.gridColor }
            },
            y: {
              min: 0,
              max: 125,
              title: {
                display: true,
                text: 'Personas expuestas / casos proyectados',
                color: colors.textColor
              },
              ticks: { color: colors.mutedColor },
              grid: { color: colors.gridColor }
            }
          }
        }
      });
    } else {
      chartDengueInstance.data.labels = model.labels;
      chartDengueInstance.data.datasets[0].data = model.serieSinPrevencion;
      chartDengueInstance.data.datasets[1].data = model.serieConTonga;
      chartDengueInstance.options.plugins.legend.labels.color = colors.textColor;
      chartDengueInstance.options.scales.x.ticks.color = colors.mutedColor;
      chartDengueInstance.options.scales.x.grid.color = colors.gridColor;
      chartDengueInstance.options.scales.y.ticks.color = colors.mutedColor;
      chartDengueInstance.options.scales.y.title.color = colors.textColor;
      chartDengueInstance.options.scales.y.grid.color = colors.gridColor;
      chartDengueInstance.update('none');
    }
  }

  /**
   * --------------------------------------------------------------------------
   * MÓDULO 2 — CAPA 2: Capilaridad 2D, Hoja de Registro DUA y Constructor de Trampa
   * --------------------------------------------------------------------------
   */
  let currentLabAverages = {
    avgPapel: 4.5,
    avgTela: 6.0,
    avgPlastico: 0.0,
    avgGeneral: 3.5
  };

  let cronometroRAF = null;
  let cronometroRunning = false;

  function readLabInputsFromDOM() {
    function getVal(id, fallback) {
      const el = document.getElementById(id);
      if (!el) return fallback;
      const v = parseFloat(el.value);
      return Number.isFinite(v) ? v : fallback;
    }

    return {
      papel: [
        getVal('mPapel1', 4.5),
        getVal('mPapel2', 5.0),
        getVal('mPapel3', 4.0)
      ],
      tela: [
        getVal('mTela1', 6.0),
        getVal('mTela2', 6.5),
        getVal('mTela3', 5.5)
      ],
      plastico: [
        getVal('mPlastico1', 0.0),
        getVal('mPlastico2', 0.0),
        getVal('mPlastico3', 0.0)
      ]
    };
  }

  function updateCapilaridadSimulationDOM() {
    const selectProtocolo = document.getElementById('selectProtocoloTiempo');
    const sliderTiempo = document.getElementById('sliderTiempoInmersion');
    const stripPapel = document.getElementById('stripPapelFill');
    const stripTela = document.getElementById('stripTelaFill');
    const stripPlastico = document.getElementById('stripPlasticoFill');
    const canvas = document.getElementById('chartCapilaridad');

    const maxTime = selectProtocolo ? parseFloat(selectProtocolo.value) || 60 : 60;
    if (sliderTiempo && parseFloat(sliderTiempo.max) !== maxTime) {
      sliderTiempo.max = String(maxTime);
      if (parseFloat(sliderTiempo.value) > maxTime) {
        sliderTiempo.value = String(maxTime);
      }
    }

    const currentTime = sliderTiempo ? parseFloat(sliderTiempo.value) || 0 : maxTime;
    const sim = computeCapilaridadPhysicsPure(currentTime, maxTime, currentLabAverages);

    // Actualizar etiqueta de tiempo si existe
    const valTiempoEl = document.getElementById('valTiempoInmersion');
    if (valTiempoEl) {
      valTiempoEl.textContent = `${Math.round(sim.t)} s / ${Math.round(sim.tMax)} s`;
    }

    // Escala visual máxima de la tira = 8.0 cm (100% de altura de la tira)
    const maxScaleCm = 8.0;
    const pctPapel = Math.min(100, Math.max(0, (sim.hPapelNow / maxScaleCm) * 100));
    const pctTela = Math.min(100, Math.max(0, (sim.hTelaNow / maxScaleCm) * 100));
    const pctPlastico = Math.min(100, Math.max(0, (sim.hPlasticoNow / maxScaleCm) * 100));

    if (stripPapel) {
      stripPapel.style.height = `${pctPapel}%`;
      stripPapel.setAttribute('data-cm', `${sim.hPapelNow.toFixed(1)} cm`);
      const labelInStrip = stripPapel.querySelector('.strip-value, span');
      if (labelInStrip) labelInStrip.textContent = `${sim.hPapelNow.toFixed(1)} cm`;
    }
    if (stripTela) {
      stripTela.style.height = `${pctTela}%`;
      stripTela.setAttribute('data-cm', `${sim.hTelaNow.toFixed(1)} cm`);
      const labelInStrip = stripTela.querySelector('.strip-value, span');
      if (labelInStrip) labelInStrip.textContent = `${sim.hTelaNow.toFixed(1)} cm`;
    }
    if (stripPlastico) {
      stripPlastico.style.height = `${pctPlastico}%`;
      stripPlastico.setAttribute('data-cm', `${sim.hPlasticoNow.toFixed(1)} cm`);
      const labelInStrip = stripPlastico.querySelector('.strip-value, span');
      if (labelInStrip) labelInStrip.textContent = `${sim.hPlasticoNow.toFixed(1)} cm`;
    }

    // Etiquetas externas opcionales de altura instantánea
    const lblPapelNow = document.getElementById('valAlturaPapel');
    const lblTelaNow = document.getElementById('valAlturaTela');
    const lblPlasticoNow = document.getElementById('valAlturaPlastico');
    if (lblPapelNow) lblPapelNow.textContent = `${sim.hPapelNow.toFixed(1)} cm`;
    if (lblTelaNow) lblTelaNow.textContent = `${sim.hTelaNow.toFixed(1)} cm`;
    if (lblPlasticoNow) lblPlasticoNow.textContent = `${sim.hPlasticoNow.toFixed(1)} cm`;

    // Actualizar Chart.js (`#chartCapilaridad`) con `chart.update('none')`
    if (!canvas || typeof window.Chart === 'undefined') return;
    const colors = getThemeChartColors();

    if (!chartCapilaridadInstance) {
      const ctx = canvas.getContext('2d');
      chartCapilaridadInstance = new window.Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Papel absorbente', 'Tela de algodón', 'Plástico PET (Impermeable)'],
          datasets: [
            {
              label: 'Ascenso capilar actual h(t) (cm)',
              data: [sim.hPapelNow, sim.hTelaNow, sim.hPlasticoNow],
              backgroundColor: [
                'rgba(212, 126, 48, 0.82)',
                'rgba(217, 4, 41, 0.78)',
                'rgba(56, 176, 0, 0.82)'
              ],
              borderColor: ['#d47e30', '#d90429', '#38b000'],
              borderWidth: 2,
              borderRadius: 6
            },
            {
              label: 'Promedio oficial Hoja de Registro x̄ (cm)',
              data: [
                currentLabAverages.avgPapel,
                currentLabAverages.avgTela,
                currentLabAverages.avgPlastico
              ],
              backgroundColor: [
                'rgba(212, 126, 48, 0.28)',
                'rgba(217, 4, 41, 0.28)',
                'rgba(56, 176, 0, 0.28)'
              ],
              borderColor: ['#8d5a2b', '#9b001a', '#2b7a00'],
              borderWidth: 2,
              borderDash: [4, 4],
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
          plugins: {
            legend: {
              labels: {
                color: colors.textColor,
                font: { family: 'Inter, sans-serif', size: 12, weight: '600' }
              }
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  return `${context.dataset.label}: ${context.parsed.y.toFixed(2)} cm`;
                }
              }
            }
          },
          scales: {
            x: {
              ticks: { color: colors.textColor, font: { weight: '600' } },
              grid: { color: colors.gridColor }
            },
            y: {
              min: 0,
              max: 8,
              title: {
                display: true,
                text: 'Altura de agua absorbida (cm)',
                color: colors.textColor
              },
              ticks: {
                color: colors.mutedColor,
                callback: function (value) {
                  return value + ' cm';
                }
              },
              grid: { color: colors.gridColor }
            }
          }
        }
      });
    } else {
      chartCapilaridadInstance.data.datasets[0].data = [
        sim.hPapelNow,
        sim.hTelaNow,
        sim.hPlasticoNow
      ];
      chartCapilaridadInstance.data.datasets[1].data = [
        currentLabAverages.avgPapel,
        currentLabAverages.avgTela,
        currentLabAverages.avgPlastico
      ];
      chartCapilaridadInstance.options.plugins.legend.labels.color = colors.textColor;
      chartCapilaridadInstance.options.scales.x.ticks.color = colors.textColor;
      chartCapilaridadInstance.options.scales.x.grid.color = colors.gridColor;
      chartCapilaridadInstance.options.scales.y.title.color = colors.textColor;
      chartCapilaridadInstance.options.scales.y.ticks.color = colors.mutedColor;
      chartCapilaridadInstance.options.scales.y.grid.color = colors.gridColor;
      chartCapilaridadInstance.update('none');
    }
  }

  function updateLabSheetDOM() {
    const rawMeasurements = readLabInputsFromDOM();
    currentLabAverages = computeLabAveragesPure(rawMeasurements);

    const elAvgPapel = document.getElementById('avgPapel');
    const elAvgTela = document.getElementById('avgTela');
    const elAvgPlastico = document.getElementById('avgPlastico');
    const elAvgGeneral = document.getElementById('avgGeneralLab');

    if (elAvgPapel) elAvgPapel.textContent = `${currentLabAverages.avgPapel.toFixed(1)} cm`;
    if (elAvgTela) elAvgTela.textContent = `${currentLabAverages.avgTela.toFixed(1)} cm`;
    if (elAvgPlastico) elAvgPlastico.textContent = `${currentLabAverages.avgPlastico.toFixed(1)} cm`;
    if (elAvgGeneral) elAvgGeneral.textContent = `${currentLabAverages.avgGeneral.toFixed(1)} cm`;

    updateCapilaridadSimulationDOM();
  }

  function resetLabToOfficialExcelValues() {
    const officialMap = {
      mPapel1: '4.5',
      mPapel2: '5.0',
      mPapel3: '4.0',
      mTela1: '6.0',
      mTela2: '6.5',
      mTela3: '5.5',
      mPlastico1: '0.0',
      mPlastico2: '0.0',
      mPlastico3: '0.0'
    };

    Object.keys(officialMap).forEach((id) => {
      const input = document.getElementById(id);
      if (input) {
        input.value = officialMap[id];
      }
    });

    updateLabSheetDOM();
  }

  function toggleCronometroAnimation() {
    const btn = document.getElementById('btnRunCronometro');
    const sliderTiempo = document.getElementById('sliderTiempoInmersion');
    const selectProtocolo = document.getElementById('selectProtocoloTiempo');
    if (!sliderTiempo) return;

    if (cronometroRunning) {
      cronometroRunning = false;
      if (cronometroRAF) cancelAnimationFrame(cronometroRAF);
      if (btn) {
        btn.textContent = '▶ Iniciar Cronómetro';
        btn.classList.remove('active');
      }
      return;
    }

    const maxTime = selectProtocolo ? parseFloat(selectProtocolo.value) || 60 : 60;
    sliderTiempo.max = String(maxTime);
    if (parseFloat(sliderTiempo.value) >= maxTime) {
      sliderTiempo.value = '0';
    }

    cronometroRunning = true;
    if (btn) {
      btn.textContent = '⏸ Pausar Cronómetro';
      btn.classList.add('active');
    }

    const startWall = performance.now();
    const initialSimTime = parseFloat(sliderTiempo.value) || 0;
    // Animamos el recorrido completo en ~4 segundos reales a 60 FPS
    const durationRealMs = 4000 * ((maxTime - initialSimTime) / maxTime || 1);

    function step(now) {
      if (!cronometroRunning) return;
      const elapsed = now - startWall;
      const progress = Math.min(1, elapsed / durationRealMs);
      const nextVal = initialSimTime + progress * (maxTime - initialSimTime);
      sliderTiempo.value = nextVal.toFixed(1);
      updateCapilaridadSimulationDOM();

      if (progress < 1) {
        cronometroRAF = requestAnimationFrame(step);
      } else {
        cronometroRunning = false;
        if (btn) {
          btn.textContent = '🔄 Reiniciar Cronómetro';
          btn.classList.remove('active');
        }
      }
    }

    cronometroRAF = requestAnimationFrame(step);
  }

  function updateTrampaBuilderDOM() {
    const selMat = document.getElementById('selectMaterialCubierta');
    const selBorde = document.getElementById('selectAjusteBorde');
    const selTrampa = document.getElementById('selectTipoTrampa');
    const scoreEl = document.getElementById('trampaEficaciaScore');
    const diagEl = document.getElementById('trampaDiagnosticoText');

    if (!selMat && !selBorde && !selTrampa) return;

    const evalResult = evaluateTrampaPrototypePure(
      selMat ? selMat.value : 'plastico',
      selBorde ? selBorde.value : 'caucho',
      selTrampa ? selTrampa.value : 'ovitrampa'
    );

    if (scoreEl) {
      scoreEl.textContent = `${evalResult.totalScore}%`;
      scoreEl.className = `trampa-score-value ${evalResult.estadoClase}`;
    }

    if (diagEl) {
      diagEl.innerHTML = `
        <strong>${evalResult.nivel} (${evalResult.totalScore}% de eficacia preventiva):</strong>
        <span>${evalResult.diagnostico}</span>
      `;
    }
  }

  /**
   * --------------------------------------------------------------------------
   * MÓDULO 3 — CAPA 2: Estudio Creativo Multimodal, AudioContext y Rúbrica Radar
   * --------------------------------------------------------------------------
   */
  let activeInfographicData = {
    canal: 'copla',
    identidad: 'afro',
    tituloFormato: 'INFOGRAFIA CANCIONERO / COPLA RITMICA',
    identidadLabel: 'Comunidad Afrodescendiente (Tonga & Ubuntu · Guachene y La Union del Salado)',
    seedLabel: 'Semilla #1',
    titular: '¡Suena la marimba y el cununo en La Unión del Salado: al zancudo le cerramos el paso!',
    q1Title: '1. Alerta Epidemiologica (Verso & Vector)',
    q1Body: 'La hembra infectada de Aedes aegypti transmite el virus por picadura diurna y deposita sus huevos en paredes de recipientes con agua limpia destapada.',
    q2Title: '2. Copla Cientifica Generada',
    q2Body: 'En Guachené y El Salado cantamos al son del tambor, medimos tres materiales con regla y con rigor: la tela subió a 6.0 cm, el papel a 4.5 cm, y con plástico PET en 0.0 cm tapamos el criadero.',
    q3Title: '3. Evidencia Cuantitativa de la Tonga',
    q3Body: 'Media de 3 muestras (2 x 10 cm): Papel x=4.5 cm (Permeable), Tela x=6.0 cm (Muy absorbente), Plástico PET x=0.0 cm (Impermeable).',
    q4Title: '4. Saber Familiar Integrado en Casa',
    q4Body: 'Práctica del hogar: Tapar la caneca con plástico grueso y caucho de neumático. Opciones DUA: Canto coral, lectura asistida y regla táctil.',
    lema: 'Ubuntu en la Tonga: Yo soy porque nosotros somos — Si tapamos el tanque en casa, protegemos a todo el barrio.'
  };

  function stripHtmlAndLatexForPDF(str) {
    if (!str) return '';
    return String(str)
      .replace(/<br\s*\/?>/gi, ' / ')
      .replace(/<[^>]+>/g, '')
      .replace(/\\bar\{x\}/g, 'Promedio')
      .replace(/\\frac\{x_1\+x_2\+x_3\}\{3\}/g, '(x1+x2+x3)/3')
      .replace(/\\text\{([^}]*)\}/g, '$1')
      .replace(/\\times/g, 'x')
      .replace(/\$/g, '')
      .replace(/[«»""]/g, '"')
      .replace(/[—–]/g, '-')
      .replace(/[^\x20-\x7E\xA0-\xFF]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function escapePdfString(str) {
    return String(str)
      .replace(/\\/g, '\\\\')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)');
  }

  function wrapPdfText(text, maxChars) {
    const clean = stripHtmlAndLatexForPDF(text);
    const words = clean.split(' ');
    const lines = [];
    let current = '';
    for (let i = 0; i < words.length; i++) {
      const w = words[i];
      if (!current) {
        current = w;
      } else if ((current + ' ' + w).length <= maxChars) {
        current += ' ' + w;
      } else {
        lines.push(current);
        current = w;
      }
    }
    if (current) lines.push(current);
    return lines;
  }

  function downloadCurrentInfographicAsPDF() {
    const d = activeInfographicData;
    const ops = [];

    // Colores según el enfoque cultural activo
    let bannerRGB = '0.85 0.47 0.02'; // Afro Ubuntu Gold
    let accentRGB = '0.01 0.52 0.78'; // Río Palo Blue
    if (d.identidad === 'nasa') {
      bannerRGB = '0.73 0.11 0.11'; // Chumbe Nasa Crimson
      accentRGB = '0.08 0.50 0.24'; // Selva Cauca Emerald
    } else if (d.identidad === 'cafetera') {
      bannerRGB = '0.24 0.15 0.14'; // Café Tostado
      accentRGB = '0.60 0.11 0.11'; // Cereza de Café
    }

    // Fondo general pergamino suave
    ops.push('0.98 0.96 0.94 rg 0 0 612 792 re f');

    // Franja superior triétnica (Nasa, Afro, Cafetera)
    ops.push('0.73 0.11 0.11 rg 0 784 204 8 re f');
    ops.push('0.85 0.47 0.02 rg 204 784 204 8 re f');
    ops.push('0.08 0.50 0.24 rg 408 784 204 8 re f');

    // Cabecera principal de la infografía
    ops.push(bannerRGB + ' rg 32 688 548 84 re f');

    const canalLine = stripHtmlAndLatexForPDF(d.tituloFormato) + ' | ' + stripHtmlAndLatexForPDF(d.seedLabel);
    ops.push('BT /F2 9 Tf 1 1 1 rg 46 754 Td (' + escapePdfString(canalLine.slice(0, 95)) + ') Tj ET');

    const titleLines = wrapPdfText(d.titular, 68).slice(0, 2);
    let ty = 735;
    for (let i = 0; i < titleLines.length; i++) {
      ops.push('BT /F2 13 Tf 1 1 1 rg 46 ' + ty + ' Td (' + escapePdfString(titleLines[i]) + ') Tj ET');
      ty -= 16;
    }

    const idLine = 'Enfoque Intercultural: ' + stripHtmlAndLatexForPDF(d.identidadLabel) + ' — IE Tecnico San Jacinto (Guachene, Cauca · 4.o Grado)';
    ops.push('BT /F1 8.5 Tf 0.98 0.93 0.75 rg 46 697 Td (' + escapePdfString(idLine.slice(0, 108)) + ') Tj ET');

    // Helper para dibujar cada uno de los 4 cuadrantes de la infografía
    function drawQuadrant(x, y, w, h, title, bodyText, borderRGB) {
      ops.push('1 1 1 rg ' + x + ' ' + y + ' ' + w + ' ' + h + ' re f');
      ops.push(borderRGB + ' RG 1.4 w ' + x + ' ' + y + ' ' + w + ' ' + h + ' re S');
      ops.push(borderRGB + ' rg ' + x + ' ' + (y + h - 22) + ' ' + w + ' 22 re f');
      const cleanT = stripHtmlAndLatexForPDF(title).slice(0, 48);
      ops.push('BT /F2 9.5 Tf 1 1 1 rg ' + (x + 10) + ' ' + (y + h - 15) + ' Td (' + escapePdfString(cleanT) + ') Tj ET');

      const lines = wrapPdfText(bodyText, 44).slice(0, 7);
      let ly = y + h - 38;
      for (let k = 0; k < lines.length; k++) {
        ops.push('BT /F1 8.8 Tf 0.12 0.16 0.22 rg ' + (x + 10) + ' ' + ly + ' Td (' + escapePdfString(lines[k]) + ') Tj ET');
        ly -= 13;
      }
    }

    // Fila superior de cuadrantes (Q1 y Q2)
    drawQuadrant(32, 536, 266, 138, d.q1Title, d.q1Body, '0.73 0.11 0.11');
    drawQuadrant(314, 536, 266, 138, d.q2Title, d.q2Body, accentRGB);

    // Fila media de cuadrantes (Q3 y Q4)
    drawQuadrant(32, 384, 266, 138, d.q3Title, d.q3Body, '0.08 0.50 0.24');
    drawQuadrant(314, 384, 266, 138, d.q4Title, d.q4Body, '0.85 0.47 0.02');

    // Panel gráfico vectorial central: Resultados del Experimento de Capilaridad (2 x 10 cm)
    ops.push('1 1 1 rg 32 118 548 250 re f');
    ops.push(bannerRGB + ' RG 1.5 w 32 118 548 250 re S');
    ops.push('0.15 0.10 0.09 rg 32 342 548 26 re f');
    ops.push('BT /F2 10 Tf 1 1 1 rg 46 351 Td (' + escapePdfString('EVIDENCIA EXPERIMENTAL DE LA TONGA: ASCENSO CAPILAR EN TIRAS DE 2 x 10 cm (PROMEDIO 3 MUESTRAS)') + ') Tj ET');

    // Gráfica de barras horizontal en PDF nativo
    // 1. Papel Absorbente (4.5 cm)
    ops.push('BT /F2 9.5 Tf 0.15 0.18 0.22 rg 48 308 Td (' + escapePdfString('1. Papel Absorbente (Permeable): 4.5 cm') + ') Tj ET');
    ops.push('0.92 0.94 0.96 rg 48 286 360 16 re f');
    ops.push('0.96 0.62 0.04 rg 48 286 225 16 re f');
    ops.push('BT /F1 8.5 Tf 0.45 0.25 0.02 rg 418 290 Td (' + escapePdfString('Pasa agua y humedad (No apto para sellar)') + ') Tj ET');

    // 2. Tela de Algodón (6.0 cm)
    ops.push('BT /F2 9.5 Tf 0.15 0.18 0.22 rg 48 252 Td (' + escapePdfString('2. Tela de Algodon (Muy Absorbente): 6.0 cm') + ') Tj ET');
    ops.push('0.92 0.94 0.96 rg 48 230 360 16 re f');
    ops.push('0.01 0.52 0.78 rg 48 230 300 16 re f');
    ops.push('BT /F1 8.5 Tf 0.02 0.32 0.52 rg 418 234 Td (' + escapePdfString('Alta capilaridad por fibras porosas') + ') Tj ET');

    // 3. Plástico PET Reciclado (0.0 cm — Óptimo)
    ops.push('BT /F2 9.5 Tf 0.08 0.45 0.20 rg 48 196 Td (' + escapePdfString('3. Plastico PET Reciclado (Impermeable): 0.0 cm [SELECCIONADO]') + ') Tj ET');
    ops.push('0.90 0.97 0.92 rg 48 174 360 16 re f');
    ops.push('0.08 0.50 0.24 rg 48 174 10 16 re f');
    ops.push('BT /F2 8.5 Tf 0.08 0.45 0.20 rg 418 178 Td (' + escapePdfString('Barrera 100% hermetica contra Aedes aegypti') + ') Tj ET');

    ops.push('BT /F1 8.5 Tf 0.25 0.28 0.32 rg 48 136 Td (' + escapePdfString('Formula Matematica Aplicada: Promedio x = (x1 + x2 + x3) / 3  |  Media general: 3.5 cm vs. Plastico PET: 0.0 cm') + ') Tj ET');

    // Pie de página intercultural y DUA
    ops.push(bannerRGB + ' rg 32 42 548 62 re f');
    const lemaLines = wrapPdfText('Lema Comunitario: ' + d.lema, 86).slice(0, 2);
    let fy = 84;
    for (let m = 0; m < lemaLines.length; m++) {
      ops.push('BT /F2 9.5 Tf 1 1 1 rg 46 ' + fy + ' Td (' + escapePdfString(lemaLines[m]) + ') Tj ET');
      fy -= 14;
    }
    ops.push('BT /F1 8 Tf 0.98 0.93 0.75 rg 46 52 Td (' + escapePdfString('Accesibilidad DUA (Pautas 4.1, 5.1, 5.2, 7.1 y 8.3) · Maestria en Educacion STEM · Universidad Santo Tomas') + ') Tj ET');

    const streamContent = ops.join('\n');

    const objects = [];
    objects.push('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');
    objects.push('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');
    objects.push('3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>\nendobj\n');
    objects.push('4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>\nendobj\n');
    objects.push('5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>\nendobj\n');
    objects.push('6 0 obj\n<< /Length ' + streamContent.length + ' >>\nstream\n' + streamContent + '\nendstream\nendobj\n');

    let pdfStr = '%PDF-1.4\n';
    const offsets = [0];
    for (let idx = 0; idx < objects.length; idx++) {
      offsets.push(pdfStr.length);
      pdfStr += objects[idx];
    }
    const xrefStart = pdfStr.length;
    pdfStr += 'xref\n0 ' + (objects.length + 1) + '\n';
    pdfStr += '0000000000 65535 f \n';
    for (let idx = 1; idx < offsets.length; idx++) {
      const pad = String(offsets[idx]).padStart(10, '0');
      pdfStr += pad + ' 00000 n \n';
    }
    pdfStr += 'trailer\n<< /Size ' + (objects.length + 1) + ' /Root 1 0 R >>\nstartxref\n' + xrefStart + '\n%%EOF';

    const bytes = new Uint8Array(pdfStr.length);
    for (let idx = 0; idx < pdfStr.length; idx++) {
      bytes[idx] = pdfStr.charCodeAt(idx) & 0xff;
    }

    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const cleanSeed = String(d.seedLabel || 'DUA').replace(/[^a-zA-Z0-9_-]/g, '_');
    link.href = url;
    link.download = 'Infografia_DUA_' + d.canal + '_' + d.identidad + '_' + cleanSeed + '.pdf';
    document.body.appendChild(link);
    link.click();
    setTimeout(function () {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 300);
  }

  function updateEstudioDivulgacionDOM(forceNewRandom) {
    const selCanal = document.getElementById('selectCanalDUA');
    const selIdentidad = document.getElementById('selectIdentidadCultural');
    const inputSaber = document.getElementById('inputSaberFamiliar');
    const previewEl = document.getElementById('previewMensajeComunitario');

    if (!previewEl) return;

    const canal = selCanal ? selCanal.value : 'copla';
    const identidad = selIdentidad ? selIdentidad.value : 'afro';
    const saber = inputSaber ? inputSaber.value : '';

    const message = generateMultimodalMessagePure(canal, identidad, saber, Boolean(forceNewRandom));

    previewEl.innerHTML = `
      <div class="estudio-preview-card">
        <div class="estudio-preview-header" style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:0.5rem;">
          <span class="badge badge-canal">${message.tituloFormato}</span>
          <span class="badge badge-identidad">🌍 ${message.identidadLabel}</span>
        </div>
        <div class="estudio-preview-body">
          ${message.cuerpoHTML}
        </div>
      </div>
    `;

    // Sincronizar estado activo para exportación inmediata a PDF
    const elHook = document.getElementById('infogHookTitle');
    const elQ1 = document.getElementById('infogQ1Body');
    const elQ2 = document.getElementById('infogQ2Body');
    const elQ3 = document.getElementById('infogQ3Body');
    const elQ4 = document.getElementById('infogQ4Body');
    const elLema = document.getElementById('infogFooterLema');

    activeInfographicData = {
      canal: canal,
      identidad: identidad,
      tituloFormato: message.tituloFormato,
      identidadLabel: message.identidadLabel,
      seedLabel: 'Diseno_' + message.variantNumber,
      titular: elHook ? elHook.textContent : '',
      q1Title: '1. Alerta Epidemiologica y Vector',
      q1Body: elQ1 ? elQ1.textContent : '',
      q2Title: '2. Evidencia / Copla del Canal DUA',
      q2Body: elQ2 ? elQ2.textContent : '',
      q3Title: '3. Ingenieria y Datos de la Tonga',
      q3Body: elQ3 ? elQ3.textContent : '',
      q4Title: '4. Saber Familiar y Accesibilidad',
      q4Body: elQ4 ? elQ4.textContent : '',
      lema: elLema ? elLema.textContent : ''
    };

    const btnPdf = document.getElementById('btnDescargarInfografiaPDF');
    if (btnPdf) {
      btnPdf.innerHTML = '<i class="fa-solid fa-file-pdf" aria-hidden="true"></i> Descargar Infografía PDF (#' + message.variantNumber + ')';
    }

    if (typeof window.reRenderMath === 'function') {
      window.reRenderMath(previewEl);
    }
  }

  /**
   * Sintetizador Web Audio API en vivo: Patrón rítmico de Marimba de Chonta y Bombo/Cununo Caucano
   * No depende de archivos MP3 externos.
   */
  let audioCtx = null;
  let rhythmIntervalId = null;
  let isPlayingRhythm = false;

  function playPercussionAndMarimbaNote(ctx, freq, isBassHit, isRimshot) {
    const now = ctx.currentTime;

    // 1. Golpe de tambor bombo / cununo
    if (isBassHit) {
      const oscDrum = ctx.createOscillator();
      const gainDrum = ctx.createGain();
      oscDrum.type = 'sine';
      oscDrum.frequency.setValueAtTime(115, now);
      oscDrum.frequency.exponentialRampToValueAtTime(42, now + 0.16);

      gainDrum.gain.setValueAtTime(0.45, now);
      gainDrum.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      oscDrum.connect(gainDrum);
      gainDrum.connect(ctx.destination);
      oscDrum.start(now);
      oscDrum.stop(now + 0.19);
    }

    // 2. Madera / Semillas (Guasá / Aro)
    if (isRimshot) {
      const oscWood = ctx.createOscillator();
      const gainWood = ctx.createGain();
      oscWood.type = 'triangle';
      oscWood.frequency.setValueAtTime(780, now);
      oscWood.frequency.exponentialRampToValueAtTime(290, now + 0.045);

      gainWood.gain.setValueAtTime(0.18, now);
      gainWood.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      oscWood.connect(gainWood);
      gainWood.connect(ctx.destination);
      oscWood.start(now);
      oscWood.stop(now + 0.055);
    }

    // 3. Nota de Marimba de Chonta (armónico cálido percusivo)
    if (freq > 0) {
      const oscMarimba = ctx.createOscillator();
      const oscHarmonic = ctx.createOscillator();
      const gainMarimba = ctx.createGain();

      oscMarimba.type = 'sine';
      oscHarmonic.type = 'triangle';

      oscMarimba.frequency.setValueAtTime(freq, now);
      oscHarmonic.frequency.setValueAtTime(freq * 4, now); // Armónico característico de la chonta

      gainMarimba.gain.setValueAtTime(0.001, now);
      gainMarimba.gain.linearRampToValueAtTime(0.28, now + 0.012);
      gainMarimba.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

      const harmonicGain = ctx.createGain();
      harmonicGain.gain.setValueAtTime(0.06, now);
      harmonicGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      oscMarimba.connect(gainMarimba);
      oscHarmonic.connect(harmonicGain);
      harmonicGain.connect(gainMarimba);
      gainMarimba.connect(ctx.destination);

      oscMarimba.start(now);
      oscHarmonic.start(now);
      oscMarimba.stop(now + 0.25);
      oscHarmonic.stop(now + 0.25);
    }
  }

  function toggleRhythmPlayback() {
    const btn = document.getElementById('btnReproducirRitmo');
    if (isPlayingRhythm) {
      isPlayingRhythm = false;
      if (rhythmIntervalId) {
        clearInterval(rhythmIntervalId);
        rhythmIntervalId = null;
      }
      if (btn) {
        btn.textContent = '🥁 Reproducir Ritmo de Marimba y Tambor';
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      }
      return;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      alert('Tu navegador no soporta síntesis de audio Web Audio API.');
      return;
    }

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    isPlayingRhythm = true;
    if (btn) {
      btn.textContent = '⏹ Detener Ritmo de Marimba y Tambor';
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
    }

    // Patrón en 6/8 (Bambuco viejo / Currulao caucano) en escala pentatónica de Re menor
    const pattern = [
      { freq: 293.66, bass: true, wood: false },  // Re4 + Bombo
      { freq: 349.23, bass: false, wood: true },  // Fa4 + Guasá
      { freq: 440.00, bass: false, wood: false }, // La4
      { freq: 523.25, bass: true, wood: true },   // Do5 + Cununo
      { freq: 440.00, bass: false, wood: false }, // La4
      { freq: 392.00, bass: true, wood: true }    // Sol4 + Bombo
    ];

    let stepIndex = 0;
    playPercussionAndMarimbaNote(
      audioCtx,
      pattern[0].freq,
      pattern[0].bass,
      pattern[0].wood
    );
    stepIndex = 1;

    rhythmIntervalId = setInterval(() => {
      if (!isPlayingRhythm) return;
      const step = pattern[stepIndex % pattern.length];
      playPercussionAndMarimbaNote(audioCtx, step.freq, step.bass, step.wood);
      stepIndex++;
    }, 220);
  }

  function updateRubricaRadarDOM() {
    const critIds = ['crit1', 'crit2', 'crit3', 'crit4', 'crit5', 'crit6'];
    const critElements = critIds.map((id) => document.getElementById(id));
    const selModalidad = document.getElementById('selectModalidadEval');
    const chkApoyo = document.getElementById('checkApoyoDUA');
    const resumenEl = document.getElementById('rubricaResumenNivel');
    const canvas = document.getElementById('chartRubricaRadar');

    if (critElements.every((el) => !el) && !canvas) return;

    const rawScores = critElements.map((el, idx) => {
      const val = el ? parseFloat(el.value) : 4;
      const lblVal = document.getElementById(`valCrit${idx + 1}`);
      if (lblVal && Number.isFinite(val)) {
        lblVal.textContent = val.toFixed(1);
      }
      return val;
    });

    const modalidad = selModalidad ? selModalidad.value : 'oral';
    const hasApoyo = chkApoyo ? chkApoyo.checked : true;

    const evalData = computeRubricaDUAPure(rawScores, modalidad, hasApoyo);

    if (resumenEl) {
      resumenEl.innerHTML = `
        <div class="rubrica-summary-card">
          <div class="rubrica-summary-header">
            <span class="badge ${evalData.badgeClass}">Promedio Integral: ${evalData.promedio.toFixed(2)} / 5.00</span>
            <span class="badge badge-outline">Modalidad: ${evalData.modTexto}</span>
            <span class="badge badge-outline">${evalData.hasApoyoDUA ? '♿ Con Ajustes Razonables y Apoyos DUA Activos' : 'Sin Apoyo Adicional Marcado'}</span>
          </div>
          <h4 class="rubrica-nivel-title">${evalData.nivelDesempeno}</h4>
          <p class="rubrica-recomendacion">${evalData.recomendacionPedagogica}</p>
        </div>
      `;
    }

    if (!canvas || typeof window.Chart === 'undefined') return;
    const colors = getThemeChartColors();

    const radarLabels = [
      '1. Comprensión Ciclo Dengue',
      '2. Rol Activo en Tonga',
      '3. Medición Capilaridad (cm)',
      '4. Cálculo de Promedios (x̄)',
      '5. Eficacia del Prototipo',
      '6. Divulgación Intercultural'
    ];

    if (!chartRubricaInstance) {
      const ctx = canvas.getContext('2d');
      chartRubricaInstance = new window.Chart(ctx, {
        type: 'radar',
        data: {
          labels: radarLabels,
          datasets: [
            {
              label: 'Desempeño del Estudiante / Tonga (1 a 5)',
              data: evalData.cleanScores,
              backgroundColor: 'rgba(212, 126, 48, 0.28)',
              borderColor: colors.accentPrimary,
              pointBackgroundColor: colors.accentPrimary,
              borderWidth: 2.5,
              pointRadius: 4
            },
            {
              label: 'Meta Formativa Esperada (Grado 4.º)',
              data: evalData.metaEsperada,
              backgroundColor: 'rgba(42, 157, 143, 0.12)',
              borderColor: colors.accentSecondary,
              pointBackgroundColor: colors.accentSecondary,
              borderDash: [5, 5],
              borderWidth: 2,
              pointRadius: 3
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
          plugins: {
            legend: {
              labels: {
                color: colors.textColor,
                font: { family: 'Inter, sans-serif', size: 12, weight: '600' }
              }
            }
          },
          scales: {
            r: {
              min: 0,
              max: 5,
              ticks: {
                stepSize: 1,
                color: colors.mutedColor,
                backdropColor: 'transparent'
              },
              grid: { color: colors.gridColor },
              angleLines: { color: colors.gridColor },
              pointLabels: {
                color: colors.textColor,
                font: { family: 'Inter, sans-serif', size: 11, weight: '600' }
              }
            }
          }
        }
      });
    } else {
      chartRubricaInstance.data.datasets[0].data = evalData.cleanScores;
      chartRubricaInstance.data.datasets[1].data = evalData.metaEsperada;
      chartRubricaInstance.options.plugins.legend.labels.color = colors.textColor;
      chartRubricaInstance.options.scales.r.ticks.color = colors.mutedColor;
      chartRubricaInstance.options.scales.r.grid.color = colors.gridColor;
      chartRubricaInstance.options.scales.r.angleLines.color = colors.gridColor;
      chartRubricaInstance.options.scales.r.pointLabels.color = colors.textColor;
      chartRubricaInstance.update('none');
    }
  }

  /* ==========================================================================
   * CAPA 3: BINDING DE EVENTOS CON DEBOUNCE Y ACCESIBILIDAD DUA
   * ========================================================================== */

  function bindModule1Events() {
    // Juego 1: Armando las 3 Escenas en Tonga
    const sceneSelects = document.querySelectorAll('.scene-order-select');
    const rolSelect = document.getElementById('rolTeatroSelect');

    if (sceneSelects.length > 0) {
      sceneSelects.forEach((sel) => {
        sel.addEventListener('change', updateTeatroGameDOM);
      });
      if (rolSelect) {
        rolSelect.addEventListener('change', updateTeatroGameDOM);
      }
      const btnCheck = document.getElementById('btnVerificarTeatro') || document.getElementById('btnCheckTeatro');
      if (btnCheck) {
        btnCheck.addEventListener('click', updateTeatroGameDOM);
      }
      updateTeatroGameDOM();
    }

    // Simulador de Transmisión del Dengue
    const dengueSliders = [
      document.getElementById('sliderRecipientesDestapados'),
      document.getElementById('sliderTemperaturaCauca'),
      document.getElementById('sliderCoberturaTonga')
    ].filter(Boolean);

    if (dengueSliders.length > 0 || document.getElementById('chartTransmisionDengue')) {
      dengueSliders.forEach((slider) => {
        slider.addEventListener('input', initOrUpdateDengueChart);
        slider.addEventListener('change', initOrUpdateDengueChart);
      });
      initOrUpdateDengueChart();
    }
  }

  function bindModule2Events() {
    // Controles del Simulador Físico 2D de Capilaridad
    const selectProtocolo = document.getElementById('selectProtocoloTiempo');
    const sliderTiempo = document.getElementById('sliderTiempoInmersion');
    const btnCrono = document.getElementById('btnRunCronometro');
    const toggleRegla = document.getElementById('toggleReglaTactil');

    if (selectProtocolo) {
      selectProtocolo.addEventListener('change', function () {
        if (sliderTiempo) {
          sliderTiempo.max = this.value;
          sliderTiempo.value = this.value;
        }
        updateCapilaridadSimulationDOM();
      });
    }

    if (sliderTiempo) {
      sliderTiempo.addEventListener('input', updateCapilaridadSimulationDOM);
      sliderTiempo.addEventListener('change', updateCapilaridadSimulationDOM);
    }

    if (btnCrono) {
      btnCrono.addEventListener('click', toggleCronometroAnimation);
    }

    if (toggleRegla) {
      toggleRegla.addEventListener('change', function () {
        const active = Boolean(this.checked);
        document.body.classList.toggle('dua-tactile-ruler', active);
        const simContainer =
          document.getElementById('simuladorCapilaridad') ||
          document.querySelector('.capilaridad-stage, .sim-stage');
        if (simContainer) {
          simContainer.classList.toggle('tactile-ruler-active', active);
          simContainer.classList.toggle('dua-high-contrast-ruler', active);
        }
      });
    }

    // Hoja de Registro DUA en Vivo (#mPapel1..3, #mTela1..3, #mPlastico1..3)
    const measurementIds = [
      'mPapel1', 'mPapel2', 'mPapel3',
      'mTela1', 'mTela2', 'mTela3',
      'mPlastico1', 'mPlastico2', 'mPlastico3'
    ];
    const measurementInputs = measurementIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (measurementInputs.length > 0) {
      const debouncedLabUpdate = debounce(updateLabSheetDOM, 60);
      measurementInputs.forEach((input) => {
        input.addEventListener('input', debouncedLabUpdate);
        input.addEventListener('change', updateLabSheetDOM);
      });
    }

    const btnResetExcel = document.getElementById('btnResetLabExcel');
    if (btnResetExcel) {
      btnResetExcel.addEventListener('click', resetLabToOfficialExcelValues);
    }

    if (measurementInputs.length > 0 || document.getElementById('chartCapilaridad')) {
      updateLabSheetDOM();
    }

    // Constructor de Cubierta y Trampa (#trampaBuilder)
    const trampaSelects = [
      document.getElementById('selectMaterialCubierta'),
      document.getElementById('selectAjusteBorde'),
      document.getElementById('selectTipoTrampa')
    ].filter(Boolean);

    if (trampaSelects.length > 0 || document.getElementById('trampaBuilder')) {
      trampaSelects.forEach((sel) => {
        sel.addEventListener('change', updateTrampaBuilderDOM);
        sel.addEventListener('input', updateTrampaBuilderDOM);
      });
      updateTrampaBuilderDOM();
    }
  }

  function bindModule3Events() {
    // Estudio Creativo Multimodal y Generador de Coplas (#estudioDivulgacion)
    const selCanal = document.getElementById('selectCanalDUA');
    const selIdentidad = document.getElementById('selectIdentidadCultural');
    const inputSaber = document.getElementById('inputSaberFamiliar');
    const btnGenerar = document.getElementById('btnGenerarMensajeTonga');
    const btnDescargarPdf = document.getElementById('btnDescargarInfografiaPDF');
    const btnRitmo = document.getElementById('btnReproducirRitmo');

    if (btnDescargarPdf) {
      btnDescargarPdf.addEventListener('click', function () {
        downloadCurrentInfographicAsPDF();
      });
    }

    if (selCanal) selCanal.addEventListener('change', function () { updateEstudioDivulgacionDOM(true); });
    if (selIdentidad) selIdentidad.addEventListener('change', function () { updateEstudioDivulgacionDOM(true); });
    if (inputSaber) {
      const debouncedPreview = debounce(function () { updateEstudioDivulgacionDOM(false); }, 100);
      inputSaber.addEventListener('input', debouncedPreview);
      inputSaber.addEventListener('change', function () { updateEstudioDivulgacionDOM(false); });
    }
    if (btnGenerar) {
      // Botón desactivado a petición del usuario: colocar su API key en el código fuente para habilitar
      btnGenerar.disabled = true;
      btnGenerar.setAttribute('aria-disabled', 'true');
      btnGenerar.style.opacity = '0.5';
      btnGenerar.style.cursor = 'not-allowed';

      btnGenerar.addEventListener('click', async function () {
        // aqui su api
        const apiKey = 'aqui su api';
        if (!apiKey || apiKey === 'aqui su api') {
          return;
        }

        updateEstudioDivulgacionDOM(true);
        const previewEl = document.getElementById('previewMensajeComunitario');
        if (!previewEl) return;

        const canalVal = selCanal ? selCanal.value : 'copla';
        const idVal = selIdentidad ? selIdentidad.value : 'afro';
        const saberVal = (inputSaber && inputSaber.value.trim()) ||
          'En casa tapamos la alberca con tapa ajustada y lavamos las paredes cada semana.';
        const randomSeed = Math.floor(1000 + Math.random() * 9000);

        const seedBadge = document.getElementById('infogSeedBadge');
        if (seedBadge) {
          seedBadge.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generando Infografía con API (Semilla #' + randomSeed + ')...';
        }
        // Rotación aleatoria del titular entre las parejas de la API para balancear RPM
        const baseModels = ['gemini-2.5-flash', 'gemma-4-31b-it', 'gemma-4-26b-a4b-it', 'gemini-2.5-flash-lite'];
        const offset = randomSeed % baseModels.length;
        const modelChain = baseModels.slice(offset).concat(baseModels.slice(0, offset));
        const localOllamaChain = ['gemma3:4b', 'qwen2.5:3b'];

        const culturalPromptDescriptions = {
          afro: 'Comunidad Afrodescendiente de Guachené y La Unión del Salado, Cauca (trabajo cooperativo en Tonga, marimba, tambores y filosofía Ubuntu: Yo soy porque nosotros somos)',
          nasa: 'Pueblo Indígena Nasa originario del Cauca, Colombia (tejido ancestral del Chumbe y la Jigra, defensa de la Madre Tierra Uma Kiwe y el agua Yu — NO confundir jamás con la agencia espacial)',
          cafetera: 'Cultura Campesina y Cafetera de Colombia (fincas cafeteras, cosecha y cuidado del agua en albercas, convite veredal y trova tradicional)'
        };
        const enfoqueDesc = culturalPromptDescriptions[idVal] || culturalPromptDescriptions.afro;

        const prompt =
          'Eres un agente diseñador de infografías pedagógicas STEM+A y DUA para 4.o grado de primaria en Guachené, Cauca (IE Técnico San Jacinto) sobre prevención del dengue. ' +
          'Semilla creativa aleatoria: #' + randomSeed + '. ' +
          'Diseña una infografía escolar inédita para el canal [' + canalVal + '] con el enfoque cultural [' + enfoqueDesc + '] ' +
          'e integrando este saber familiar: "' + saberVal + '". ' +
          'Devuelve EXCLUSIVAMENTE un objeto JSON válido con estas 6 claves exactas en español (sin bloques markdown ni asteriscos): ' +
          '{"titular": "Título o gancho impactante del póster acorde al canal y cultura", ' +
          '"q1": "Explicación de cómo se transmite el dengue por la picadura del mosquito Aedes aegypti infectado y el riesgo de agua destapada", ' +
          '"q2": "Explicación o estrofa rimada con los promedios del experimento escolar en tiras de 2x10 cm (Papel 4.5 cm permeable, Tela 6.0 cm muy absorbente, Plástico PET 0.0 cm impermeable)", ' +
          '"q3": "Justificación de ingeniería del diseño de la cubierta hermética o trampa sin aberturas visibles sobre el recipiente", ' +
          '"q4": "Integración del saber familiar en casa y los apoyos de accesibilidad DUA (macrotipo, regla táctil, Braille o audio)", ' +
          '"lema": "Lema intercultural de cierre honrando al Pueblo Indígena Nasa, la Tonga Afro Ubuntu o la Cultura Cafetera"}';

        function applyInfographicJSON(rawText, modelLabel, tokenCount) {
          const cleaned = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
          const startIdx = cleaned.indexOf('{');
          const endIdx = cleaned.lastIndexOf('}');
          if (startIdx !== -1 && endIdx !== -1) {
            const parsed = JSON.parse(cleaned.slice(startIdx, endIdx + 1));
            const elHook = document.getElementById('infogHookTitle');
            const elQ1 = document.getElementById('infogQ1Body');
            const elQ2 = document.getElementById('infogQ2Body');
            const elQ3 = document.getElementById('infogQ3Body');
            const elQ4 = document.getElementById('infogQ4Body');
            const elLema = document.getElementById('infogFooterLema');
            if (elHook && parsed.titular) elHook.textContent = parsed.titular.replace(/\*\*/g, '');
            if (elQ1 && parsed.q1) elQ1.textContent = parsed.q1.replace(/\*\*/g, '');
            if (elQ2 && parsed.q2) elQ2.textContent = parsed.q2.replace(/\*\*/g, '');
            if (elQ3 && parsed.q3) elQ3.textContent = parsed.q3.replace(/\*\*/g, '');
            if (elQ4 && parsed.q4) elQ4.textContent = parsed.q4.replace(/\*\*/g, '');
            if (elLema && parsed.lema) elLema.innerHTML = '<strong>' + parsed.lema.replace(/\*\*/g, '') + '</strong>';
            if (seedBadge) {
              seedBadge.innerHTML = '<i class="fa-solid fa-microchip"></i> API: ' + modelLabel + ' (' + tokenCount + ' tok · #' + randomSeed + ')';
            }
            activeInfographicData.canal = canalVal;
            activeInfographicData.identidad = idVal;
            activeInfographicData.seedLabel = modelLabel + '_Semilla_' + randomSeed;
            if (parsed.titular) activeInfographicData.titular = parsed.titular.replace(/\*\*/g, '');
            if (parsed.q1) activeInfographicData.q1Body = parsed.q1.replace(/\*\*/g, '');
            if (parsed.q2) activeInfographicData.q2Body = parsed.q2.replace(/\*\*/g, '');
            if (parsed.q3) activeInfographicData.q3Body = parsed.q3.replace(/\*\*/g, '');
            if (parsed.q4) activeInfographicData.q4Body = parsed.q4.replace(/\*\*/g, '');
            if (parsed.lema) activeInfographicData.lema = parsed.lema.replace(/\*\*/g, '');
            if (btnDescargarPdf) {
              btnDescargarPdf.innerHTML = '<i class="fa-solid fa-file-pdf" aria-hidden="true"></i> Descargar Infografía PDF (#' + randomSeed + ')';
            }
            return true;
          }
          return false;
        }

        let resolved = false;
        for (let i = 0; i < modelChain.length; i++) {
          const mdl = modelChain[i];
          const genCfg = { temperature: 0.75, maxOutputTokens: 1600 };
          if (mdl.indexOf('gemini') !== -1) {
            genCfg.responseMimeType = 'application/json';
          }
          try {
            const resp = await fetch(
              'https://generativelanguage.googleapis.com/v1beta/models/' + mdl + ':generateContent?key=' + apiKey,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  contents: [{ parts: [{ text: prompt }] }],
                  generationConfig: genCfg
                })
              }
            );
            if (!resp.ok) continue;
            const data = await resp.json();
            const parts = (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) || [];
            const answerParts = parts.filter(function (p) { return !p.thought; });
            const fullText = (answerParts.length > 0 ? answerParts : parts).map(function (p) { return p.text || ''; }).join('\n');
            const usage = data.usageMetadata || {};
            if (fullText && applyInfographicJSON(fullText, mdl, usage.totalTokenCount || 0)) {
              resolved = true;
              break;
            }
          } catch (err) {
            continue;
          }
        }

        // Nivel 4: Paracaídas Local Ollama (127.0.0.1:11434) en Ryzen 5 4600H
        if (!resolved) {
          for (let j = 0; j < localOllamaChain.length; j++) {
            const localMdl = localOllamaChain[j];
            try {
              const oResp = await fetch('http://127.0.0.1:11434/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  model: localMdl,
                  prompt: prompt,
                  stream: false,
                  options: { temperature: 0.7, num_predict: 450, num_thread: 10 }
                })
              });
              if (!oResp.ok) continue;
              const oData = await oResp.json();
              if (oData && oData.response) {
                const totalLocalTok = (oData.prompt_eval_count || 0) + (oData.eval_count || 0);
                if (applyInfographicJSON(oData.response, 'ollama/' + localMdl, totalLocalTok)) {
                  resolved = true;
                  break;
                }
              }
            } catch (e) {
              continue;
            }
          }
        }
      });
    }
    if (btnRitmo) {
      btnRitmo.addEventListener('click', toggleRhythmPlayback);
    }

    if (document.getElementById('previewMensajeComunitario')) {
      updateEstudioDivulgacionDOM();
    }

    // Calculadora de Rúbrica Formativa DUA (#chartRubricaRadar)
    const critIds = ['crit1', 'crit2', 'crit3', 'crit4', 'crit5', 'crit6'];
    const critInputs = critIds.map((id) => document.getElementById(id)).filter(Boolean);
    const selModalidad = document.getElementById('selectModalidadEval');
    const chkApoyo = document.getElementById('checkApoyoDUA');

    if (critInputs.length > 0 || document.getElementById('chartRubricaRadar')) {
      critInputs.forEach((el) => {
        el.addEventListener('input', updateRubricaRadarDOM);
        el.addEventListener('change', updateRubricaRadarDOM);
      });
      if (selModalidad) selModalidad.addEventListener('change', updateRubricaRadarDOM);
      if (chkApoyo) chkApoyo.addEventListener('change', updateRubricaRadarDOM);
      updateRubricaRadarDOM();
    }
  }

  /**
   * Inicialización maestra de todos los simuladores activos y escucha de cambio de tema
   */
  function initSimulators() {
    bindModule1Events();
    bindModule2Events();
    bindModule3Events();

    // Sincronizar colores de Chart.js sin parpadeos cuando el usuario cambie el tema claro/oscuro
    window.addEventListener('stem:themechange', function () {
      initOrUpdateDengueChart();
      updateCapilaridadSimulationDOM();
      updateRubricaRadarDOM();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSimulators);
  } else {
    initSimulators();
  }
})();
