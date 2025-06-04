import { PopIt, BPMN } from '../types';

export const popItService = {
  async getAllPopIts(): Promise<PopIt[]> {
    // TODO: Replace with database query
    return [];
  },

  async createPopIt(popIt: Omit<PopIt, 'id'>): Promise<PopIt> {
    // TODO: Replace with database insert
    return {
      id: Date.now().toString(),
      ...popIt
    };
  },

  async updatePopIt(id: string, popIt: Partial<PopIt>): Promise<PopIt> {
    // TODO: Replace with database update
    return {
      id,
      ...popIt as PopIt
    };
  }
};

export const bpmnService = {
  async getAllBPMNs(): Promise<BPMN[]> {
    // TODO: Replace with database query
    return [];
  },

  async createBPMN(bpmn: Omit<BPMN, 'id'>): Promise<BPMN> {
    // TODO: Replace with database insert
    return {
      id: Date.now().toString(),
      ...bpmn
    };
  },

  async updateBPMN(id: string, bpmn: Partial<BPMN>): Promise<BPMN> {
    // TODO: Replace with database update
    return {
      id,
      ...bpmn as BPMN
    };
  }
};