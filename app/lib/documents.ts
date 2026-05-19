export interface ConstitutionalDoc {
  id: string;
  label: string;
  year: string;
  shortYear: string;
  url: string;
  defaultActive: boolean;
}

export const DOCUMENTS: ConstitutionalDoc[] = [
  {
    id: "rev2011",
    label: "Révision constitutionnelle",
    year: "Loi N°11/002 · 20 Jan 2011",
    shortYear: "2011",
    url: "https://presidence.cd/uploads/files/Loi%20N%C2%B011:002%20du%2020%20Janv%202011%20portant%20re%CC%81vision%20de%20certains%20articles%20de%20la%20Constitution%20de%20la%20RDC%20du%2018%20Fev%202006.pdf",
    defaultActive: true,
  },
  {
    id: "const2006",
    label: "Constitution 3ème République",
    year: "18 Février 2006",
    shortYear: "2006",
    url: "https://presidence.cd/uploads/files/Constitution%20de%20la%203me%20Republique.%2018%20Fev%202006.pdf",
    defaultActive: true,
  },
  {
    id: "trans2003",
    label: "Constitution de la Transition",
    year: "2003",
    shortYear: "2003",
    url: "https://presidence.cd/uploads/files/Constitution%20de%20la%20Transition.pdf",
    defaultActive: false,
  },
  {
    id: "accord2002",
    label: "Accord Global et Inclusif",
    year: "Pretoria · 2002",
    shortYear: "2002",
    url: "https://presidence.cd/uploads/files/Annexe%20Accord%20Global%20et%20Inclusif.pdf",
    defaultActive: false,
  },
  {
    id: "trans1992",
    label: "Constitution de la Transition",
    year: "1992",
    shortYear: "1992",
    url: "https://presidence.cd/uploads/files/Constitution%20de%20la%20Transition%201992.pdf",
    defaultActive: false,
  },
  {
    id: "rep2_1967",
    label: "Constitution 2ème République",
    year: "24 Juin 1967",
    shortYear: "1967",
    url: "https://presidence.cd/uploads/files/Constitution%20et%20lois%20constitutionnelles%20de%20la%202me%20Republique%2024%20Juin%201967.pdf.pdf",
    defaultActive: false,
  },
  {
    id: "luluabourg1964",
    label: "Constitution de Luluabourg",
    year: "1er Août 1964",
    shortYear: "1964",
    url: "https://presidence.cd/uploads/files/Constitution%201er%20Aout%201964.pdf",
    defaultActive: false,
  },
  {
    id: "loi1960b",
    label: "Loi fondamentale",
    year: "17 Juin 1960",
    shortYear: "1960b",
    url: "https://presidence.cd/uploads/files/Loi%20fondamentale%2017%20Juin%201960.pdf",
    defaultActive: false,
  },
  {
    id: "loi1960a",
    label: "Loi fondamentale",
    year: "19 Mai 1960",
    shortYear: "1960a",
    url: "https://presidence.cd/uploads/files/3358f681f26f509e659ac7ea60d5105f.pdf",
    defaultActive: false,
  },
  {
    id: "charte1908",
    label: "Charte Coloniale",
    year: "18 Octobre 1908",
    shortYear: "1908",
    url: "https://presidence.cd/uploads/files/Charte%20Coloniale%20du%2018%20Oct%201908.pdf",
    defaultActive: false,
  },
];
