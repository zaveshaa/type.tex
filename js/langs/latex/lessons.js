export const lessons = [
  {
    id: 'l1-text',
    title: '1. Text, spaces, symbols',
    intro: 'Type the line exactly as given.',
    tasks: [
      { source: 'x', hint: 'a single character' },
      { source: 'a + b', hint: 'spaces around + are good style' },
      { source: '2x - 5', hint: 'the minus is a plain hyphen' },
      { source: 'x = 10', hint: 'a regular =' },
    ],
  },
  {
    id: 'l2-mathmode',
    title: '2. Math mode $ ... $',
    intro: 'Formulas are wrapped in dollar signs. $x$ is an inline formula.',
    tasks: [
      { source: '$x$', hint: 'opening and closing $' },
      { source: '$a + b$', hint: 'the formula goes between the $' },
      { source: '$2 + 2 = 4$', hint: '$, formula, $' },
      { source: 'Speed $v$ depends on $t$.', hint: 'text and math mix freely' },
    ],
  },
  {
    id: 'l3-scripts',
    title: '3. Superscripts and subscripts',
    intro: '^ is a superscript, _ is a subscript. Wrap {braces} around multi-character arguments.',
    tasks: [
      { source: '$a^2$', hint: 'caret is Shift+6' },
      { source: '$x_i$', hint: 'underscore is Shift+minus' },
      { source: '$x_i^2$', hint: 'they combine' },
      { source: '$a^{10}$', hint: 'two digits need braces {10}' },
      { source: '$v_1 + v_2$', hint: 'two subscripts' },
    ],
  },
  {
    id: 'l4-fracs',
    title: '4. Fractions \\frac{}{}',
    intro: '\\frac{numerator}{denominator}. The backslash comes first.',
    tasks: [
      { source: '$\\frac{a}{b}$', hint: 'backslash first: Shift+\\' },
      { source: '$\\frac{1}{2}$', hint: 'digits inside braces' },
      { source: '$\\frac{1}{2} + \\frac{1}{3}$', hint: 'two fractions' },
      { source: '$\\frac{x^2}{\\sqrt{2}}$', hint: 'a fraction containing a root' },
    ],
  },
  {
    id: 'l5-roots',
    title: '5. Roots \\sqrt',
    intro: '\\sqrt{x} is a square root, \\sqrt[n]{x} is the nth root.',
    tasks: [
      { source: '$\\sqrt{2}$', hint: '\\sqrt with a braced argument' },
      { source: '$\\sqrt{x + 1}$', hint: 'spaces inside braces are fine' },
      { source: '$\\sqrt[3]{8}$', hint: 'the degree goes in [3]' },
      { source: '$\\frac{-b + \\sqrt{b^2 - 4ac}}{2a}$', hint: 'the discriminant' },
    ],
  },
  {
    id: 'l6-greek',
    title: '6. Greek letters',
    intro: 'Commands start with a backslash: \\alpha, \\beta, \\pi, \\theta, \\sigma. Case matters.',
    tasks: [
      { source: '$\\alpha + \\beta$', hint: 'lowercase command names' },
      { source: '$\\pi \\approx 3.14159$', hint: '\\approx means approximately' },
      { source: '$\\theta = 30^\\circ$', hint: '\\circ is the degree sign' },
      { source: '$\\Sigma x_i$', hint: 'capital \\Sigma, subscript with _' },
    ],
  },
  {
    id: 'l7-bigops',
    title: '7. Sums and integrals',
    intro: '\\sum, \\int. Bounds via _ (below) and ^ (above). \\, is a thin space.',
    tasks: [
      { source: '$\\sum_{i=1}^{n} i$', hint: '_{...} and ^{...} after \\sum' },
      { source: '$\\sum_{k=0}^{\\infty} \\frac{1}{k!}$', hint: '\\infty is infinity' },
      { source: '$\\int_0^1 x \\, dx$', hint: '\\, thin space before dx' },
      { source: '$\\lim_{x \\to 0} \\frac{\\sin x}{x}$', hint: '\\to is the arrow, \\lim below' },
    ],
  },
  {
    id: 'l8-brackets',
    title: '8. Stretchy brackets',
    intro: '\\left( ... \\right) scales brackets to their content — required around fractions.',
    tasks: [
      { source: '$\\left( \\frac{a}{b} \\right)$', hint: '\\left and \\right must pair up' },
      { source: '$\\left[ 0, 1 \\right]$', hint: 'square brackets too' },
      { source: '$\\left| x \\right|$', hint: '|x| is absolute value' },
      { source: '$\\left\\{ n \\in \\mathbb{N} \\right\\}$', hint: 'braces are escaped as \\{ \\}' },
    ],
  },
  {
    id: 'l9-matrices',
    title: '9. Matrices and ampersands',
    intro: '\\begin{pmatrix} ... \\end{pmatrix}: rows via \\\\, columns via &. begin/end must match.',
    tasks: [
      { source: '$\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$', hint: 'double backslash \\\\ starts a new row' },
      { source: '$\\begin{bmatrix} a \\\\ b \\end{bmatrix}$', hint: 'b means square brackets' },
      { source: '$A = \\begin{pmatrix} x_{11} & x_{12} \\\\ x_{21} & x_{22} \\end{pmatrix}$', hint: 'subscripts inside the matrix' },
    ],
  },
  {
    id: 'l10-text',
    title: '10. Text inside formulas',
    intro: '\\text{...} writes plain text (with spaces) inside math. \\mathbb{N} is blackboard bold.',
    tasks: [
      { source: '$\\text{speed} = v$', hint: '\\text with braced content' },
      { source: '$\\text{if } x > 0$', hint: 'spaces inside \\text matter' },
      { source: '$n \\in \\mathbb{N}$', hint: '\\mathbb for number sets' },
      { source: '$\\forall x \\, \\exists y$', hint: '\\forall for all, \\exists exists' },
    ],
  },
  {
    id: 'l11-circuits',
    title: '11. Physics: circuits',
    intro: 'Circuit laws as formulas: Ohm, series and parallel, power, impedance, Kirchhoff.',
    tasks: [
      { source: '$I = \\frac{U}{R}$', hint: 'Ohm\'s law: current = voltage / resistance' },
      { source: '$U = I R$', hint: 'the same law, solved for voltage' },
      { source: '$R = R_1 + R_2$', hint: 'series: resistances add' },
      { source: '$\\frac{1}{R} = \\frac{1}{R_1} + \\frac{1}{R_2}$', hint: 'parallel: reciprocals add' },
      { source: '$P = U I = I^2 R$', hint: 'power in two forms' },
      { source: '$Z = \\sqrt{R^2 + (\\omega L - \\frac{1}{\\omega C})^2}$', hint: 'impedance of an RLC circuit' },
      { source: '$\\sum_k I_k = 0$', hint: 'Kirchhoff current law' },
      { source: '$\\sum_k U_k = 0$', hint: 'Kirchhoff voltage law' },
    ],
  },
];

export function totalTasks() {
  return lessons.reduce((n, l) => n + l.tasks.length, 0);
}
