export interface ResultadoValidacaoEmail {
  valido: boolean;
  entregavel: boolean;
  score: number;
  classificacao: 'verdadeiro' | 'suspeito' | 'descartavel' | 'invalido';
  email: string;
  user?: string;
  dominio?: string;
  sugestao?: string | null;
  tipoProvedor?: 'gratuito_popular' | 'corporativo' | 'descartavel' | 'governamental' | 'educacional';
  servidoresMx?: string[];
  possuiMxValido?: boolean;
  ehDescartavel?: boolean;
  ehRoleBased?: boolean;
  ehTrollOuFake?: boolean;
  detalhesTroll?: string | null;
  motivos?: string[];
  audit?: {
    timestamp: string;
    dnsProvider: string;
    latency: string;
  };
}

export declare class ValidadorMailPro {
  static validarSintaxe(email: string): { valido: boolean; motivo?: string; user?: string; domain?: string };
  static validarLocal(email: string): ResultadoValidacaoEmail;
  static consultarMxDns(domain: string): Promise<{ temMx: boolean; nxdomain?: boolean; servidores?: string[] }>;
  static validarCompleto(email: string): Promise<ResultadoValidacaoEmail>;
}

export default ValidadorMailPro;
