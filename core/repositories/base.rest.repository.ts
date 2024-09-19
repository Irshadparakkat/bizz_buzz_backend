import axios from 'axios';
export abstract class BaseRESTRepository<T> {
  protected entry: string = '';
  constructor() {
    this.entry = process.env.REST_API_URL ?? 'http://localhost:3000';
  }

  async axiosGet(url: string): Promise<T[]> {
    const response = await axios.get<T[]>(`${this.entry}/${url}`);
    return response.data;
  }

  async axiosPost(url: string, data: Partial<T>): Promise<T[]> {
    const response = await axios.post<T[]>(`${this.entry}/${url}`, data);
    return response.data;
  }

  async axiosPut(url: string, data: Partial<T>): Promise<T[]> {
    const response = await axios.put<T[]>(`${this.entry}/${url}`, data);
    return response.data;
  }

  async axiosDelete(url: string): Promise<{ status: boolean }> {
    const response = await axios.delete<{ status: boolean }>(
      `${this.entry}/${url}`,
    );
    return response.data;
  }
}
