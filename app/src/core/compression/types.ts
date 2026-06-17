export interface CompressionStep<TCode> {
  code: TCode;
  stringCode: string; 
}

export interface DecompressionResult<TStep> {
  steps: TStep[];
  resultString: string;
}