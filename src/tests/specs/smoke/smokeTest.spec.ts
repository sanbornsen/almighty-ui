import { browser } from 'protractor';
import { PlannerPage } from '../../page_objects/planner';
import * as support from '../../support';

/* Smoke Tests */

describe('Planner Smoke Tests:', () => {
  let planner: PlannerPage;
  let c = new support.Constants();

  beforeAll(async () => {
    await support.desktopTestSetup();
    planner = new PlannerPage(browser.baseUrl);
    await planner.openInBrowser();
    await planner.waitUntilUrlContains('typegroup');
  });

  beforeEach(async () => {
    await planner.ready();
  });

  afterEach(async () => {
    await planner.resetState();
  });

  it('create a work item and add/remove assignee', async () => {
    await planner.createWorkItem(c.newWorkItem1);
    expect(await planner.workItemList.hasWorkItem(c.newWorkItem1.title)).toBeTruthy();
    await planner.workItemList.clickWorkItem(c.newWorkItem1.title);
    await planner.quickPreview.addAssignee(c.user1 + ' (me)');
    expect(await planner.quickPreview.getAssignees()).toContain(c.user1);
    await planner.quickPreview.close();
    await planner.workItemList.clickWorkItem(c.newWorkItem1.title);
    await browser.sleep(2000);
    await planner.quickPreview.removeAssignee(c.user1 + ' (me)');
    expect(await planner.quickPreview.getAssignees()).not.toContain(c.user1);
    await planner.quickPreview.close();
  });

  it('update workitem title/description', async () => {
    await planner.createWorkItem(c.newWorkItem2);
    expect(await planner.workItemList.hasWorkItem(c.newWorkItem2.title)).toBeTruthy();
    await planner.workItemList.clickWorkItem(c.newWorkItem2.title);
    await planner.quickPreview.updateTitle(c.updatedWorkItem.title);
    await planner.quickPreview.close();
    await planner.workItemList.clickWorkItem(c.updatedWorkItem.title);
    await planner.quickPreview.updateDescription(c.updatedWorkItem.description);
    expect(await planner.quickPreview.getDescription()).toBe(c.updatedWorkItem.description);
    await planner.quickPreview.close();
    expect(await planner.workItemList.hasWorkItem(c.newWorkItem2.title, true)).toBeFalsy();
    expect(await planner.workItemList.hasWorkItem(c.updatedWorkItem.title)).toBeTruthy();
  });

  it('update of empty workitem title is not allowed', async () => {
    let title = await planner.createUniqueWorkItem();
    await planner.workItemList.clickWorkItem(title);
    await planner.quickPreview.updateTitle('');
    expect(await planner.quickPreview.getTitleError()).toBe('Empty title not allowed');
  });

  it('Check WorkItem creator name and image is reflected', async () => {
    await planner.workItemList.clickWorkItem(c.workItemTitle2);
    await planner.quickPreview.ready();
    expect(await planner.quickPreview.getCreator()).toBe(c.user1);
    expect(await planner.quickPreview.getCreatorAvatar()).toBe(c.user_avatar);
    await planner.quickPreview.close();
  });

  it('Associate workitem with an Area', async () => {
    let title = await planner.createUniqueWorkItem();
    await planner.workItemList.clickWorkItem(title);
    await planner.quickPreview.addArea(c.dropdownareaTitle1);
    expect(await planner.quickPreview.getArea()).toBe(c.areaTitle1);
    await planner.quickPreview.close();

    await planner.workItemList.clickWorkItem(title);
    expect(await planner.quickPreview.getArea()).toBe(c.areaTitle1);
    await planner.quickPreview.addArea(c.dropdownareaTitle2);
    expect(await planner.quickPreview.getArea()).not.toBe(c.areaTitle1);
    expect(await planner.quickPreview.getArea()).toBe(c.areaTitle2);
    await planner.quickPreview.close();
  });

  it('Associate/Re-associate workitem with an Iteration', async () => {
    //add new iteration
    let title = await planner.createUniqueWorkItem();
    await planner.workItemList.clickWorkItem(title);
    await planner.quickPreview.addIteration(c.dropdownIteration1);
    expect(await planner.quickPreview.getIteration()).toBe(c.iteration1);
    await planner.quickPreview.close();

    //update iteration
    await planner.workItemList.clickWorkItem(title);
    expect(await planner.quickPreview.getIteration()).toBe(c.iteration1);
    await planner.quickPreview.addIteration(c.dropdownIteration_2);
    expect(await planner.quickPreview.getIteration()).toBe(c.iteration2);

    //search iteration
    await planner.workItemList.clickWorkItem(title);
    await planner.quickPreview.typeaHeadSearch(c.randomText);
    expect(await planner.quickPreview.iterationDropdown.menu.getTextWhenReady()).toBe('No matches found.');
    await planner.quickPreview.iterationDropdownCloseButton.clickWhenReady();
    await planner.quickPreview.iterationDropdown.clickWhenReady();
    expect(await planner.quickPreview.iterationDropdown.menu.getTextWhenReady()).not.toBe('No matches found.');
  });

  it('Scenario-Quick Add should support Scenario, papercuts and fundamentals' , async () => {
    let wiTypes = await planner.quickAdd.workItemTypes();
    expect(wiTypes.length).toBe(3);
    expect(wiTypes[0]).toBe('Scenario');
    expect(wiTypes[1]).toBe('Fundamental');
    expect(wiTypes[2]).toBe('Papercuts');
  });

  it('Experiences-Quick Add should support Experience and Value proposition', async () => {
    await planner.sidePanel.clickExperience();
    let wiTypes = await planner.quickAdd.workItemTypes();
    expect(wiTypes.length).toBe(2);
    expect(wiTypes[0]).toBe('Experience');
    expect(wiTypes[1]).toBe('Value Proposition');
  });

  it('Requirement-Quick Add should support Feature and Bug', async () => {
    await planner.sidePanel.clickRequirement();
    let wiTypes = await planner.quickAdd.workItemTypes();
    expect(wiTypes.length).toBe(2);
    expect(wiTypes[0]).toBe('Feature');
    expect(wiTypes[1]).toBe('Bug');
  });

  it('Edit Comment and Save', async () => {
    await planner.createWorkItem(c.newWorkItem3);
    expect(await planner.workItemList.hasWorkItem(c.newWorkItem3.title)).toBeTruthy();
    await planner.workItemList.clickWorkItem(c.newWorkItem3.title);
    await planner.quickPreview.addCommentAndSave(c.comment);
    expect(await planner.quickPreview.getComments()).toContain(c.comment);
  });

  it('Edit Comment and Cancel', async () => {
    let title = await planner.createUniqueWorkItem();
    await planner.workItemList.clickWorkItem(title);
    await planner.quickPreview.addCommentAndCancel(c.comment);
    expect(await planner.quickPreview.getComments()).not.toContain('new comment');
  });

  it('Create custom query', async () => {
    await planner.sidePanel.clickRequirement();
    await planner.workItemList.overlay.untilHidden();
    await planner.header.selectFilter('State', 'in progress');
    await planner.workItemList.overlay.untilHidden();
    await planner.header.saveFilters('Query 1');
    await planner.workItemList.overlay.untilHidden();
    await planner.sidePanel.customQuery.untilTextIsPresent('Query 1');
    expect(await planner.sidePanel.getMyFiltersList()).toContain('Query 1');
  });

  it('Delete custom query', async () => {
    await planner.sidePanel.clickRequirement();
    await planner.workItemList.overlay.untilHidden();
    await planner.header.selectFilter('State', 'resolved');
    await planner.workItemList.overlay.untilHidden();
    await planner.header.saveFilters('My filter');
    await planner.workItemList.overlay.untilHidden();
    await planner.quickPreview.notificationToast.untilHidden();
    await planner.sidePanel.customQuery.untilTextIsPresent('My filter');
    expect(await planner.sidePanel.getMyFiltersList()).toContain('My filter');
    await planner.sidePanel.selectcustomFilterKebab('My filter');
    await planner.sidePanel.deleteCustomQuery.clickWhenReady();
    await planner.confirmModalButton.clickWhenReady();
    await browser.sleep(1000);
    expect(await planner.sidePanel.getMyFiltersList()).not.toContain('My filter');
  });

  it('Update work item with a label and validate description', async () => {
    let title = await planner.createUniqueWorkItem();
    await planner.workItemList.clickWorkItem(title);
    await planner.quickPreview.updateDescription('My new description');
    await planner.quickPreview.createNewLabel('Validate description label');
    expect(await planner.quickPreview.getLabels()).toContain('Validate description label');
    await planner.quickPreview.close();
    await planner.workItemList.clickWorkItem(title);
    await planner.quickPreview.addLabel('Validate description label', true);
    expect(await planner.quickPreview.getDescription()).toBe('My new description');
    await planner.quickPreview.close();
  });

  it('Create a work item and Open detail page', async () => {
    await planner.quickAdd.addAndOpenWorkItem('new detail workItem', 'Scenario');
    await planner.quickPreview.notificationToast.untilCount(1);
    await planner.quickPreview.notificationToast.untilHidden();
    await planner.detailPage.closeButton.ready();
    expect(await browser.getCurrentUrl()).toContain('detail');
    await planner.detailPage.titleInput.untilTextIsPresentInValue('new detail workItem');
    await planner.detailPage.close();
    await planner.waitUntilUrlContains('typegroup');
    expect(await planner.workItemList.hasWorkItem('new detail workItem')).toBeTruthy();
  });

  it('Infotip opens on clicking on infotip icon and closes on outside click', async () => {
    await planner.sidePanel.infotipIconExperience.clickWhenReady();
    await planner.sidePanel.infotipIconRequirement.clickWhenReady();
    expect(await planner.sidePanel.infotipPopover.count()).toBe(1);
  });

  it('Add new work-item to the selected iteration', async () => {
    await planner.workItemList.overlay.untilHidden();
    await planner.sidePanel.clickIteration('Iteration_1');
    await planner.quickAdd.addWorkItem({title : 'Add new work item to iteration test'});
    expect(await planner.workItemList.hasWorkItem('Add new work item to iteration test')).toBeTruthy();
    await planner.quickPreview.notificationToast.untilCount(1);
    await planner.quickPreview.notificationToast.untilHidden();
    await planner.sidePanel.clickScenarios();
    await planner.sidePanel.clickIteration('Iteration_1');
    expect(await planner.workItemList.hasWorkItem('Add new work item to iteration test')).toBeTruthy();
  });
});
