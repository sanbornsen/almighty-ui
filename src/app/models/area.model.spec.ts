import {
  AreaMapper,
  AreaUI,
  AreaService
} from './area.model';

describe('Unit Test :: Area Modal', () => {
  it('should execute the canary test', () => {
    return expect(true).toBe(true)
  });

  it('should correctly convert to UI model - 1', () => {
    const aMapper = new AreaMapper();
    const input: AreaService = {
      id: 'qr3R',
      attributes: {
        name: 'Area 1',
        parent_path: '/40bbdd3d-8b5d/40bbdd3d-8b5e',
        parent_path_resolved: '/devtools/planner/planner-ui',
      },
      type: 'areas'
    };
    const output: AreaUI = aMapper.toUIModel(input);
    const expectedOutput: AreaUI = {
      id: 'qr3R',
      name: 'Area 1',
      parentPath: '/40bbdd3d-8b5d/40bbdd3d-8b5e',
      parentPathResolved: '/devtools/planner/planner-ui'
    };
    return expect(expectedOutput).toEqual(output);
  });
});
