import { browser, by, ElementFinder } from 'protractor';
import * as ui from '../../ui';
import { BaseElement } from './../base.element';
import { WorkItemListEntry } from './workitem-list-entry';
import { WorkItemQuickAdd } from './workitem-quickadd';

export class WorkItemList extends BaseElement {
  overlay = new BaseElement(this.$('div.lock-overlay-list'));
  datatableHeaderdiv = new ui.BaseElement(this.$('.datatable-header'), 'datatable header div');
  datatableHeaderCell = new ui.BaseElementArray(this.$$('datatable-header-cell'), 'datatable header cell');
  datatableHeaderCellLabel = new ui.BaseElementArray(this.$$('datatable-header-cell-label'));
  datatableRow = new ui.BaseElementArray(this.$$('datatable-body-row'), 'datatable row');
  childWorkItemTypeDropdown = new ui.Dropdown(
    this.$('.f8-quick-add-inline .dropdown-toggle'),
    this.$('.f8-quick-add-inline .dropdown-menu'),
    'Child WorkItem Type dropdown'
  );

  constructor(el: ElementFinder, name = 'Work Item List') {
    super(el, name);
  }

  async ready() {
    await super.ready();
    await this.overlay.untilHidden();
  }

  async clickWorkItem(title: string) {
    await this.overlay.untilHidden();
    await this.workItem(title).openQuickPreview();
  }

  async hasWorkItem(title: string, showCompleted = false): Promise<boolean> {
    if (!showCompleted) {
      await this.workItem(title).untilTextIsPresent(title);
    }
    return this.workItem(title).isPresent();
  }

  workItem(title: string): WorkItemListEntry {
    return new WorkItemListEntry(
      this.element(by.xpath("//datatable-body-row[.//p[text()='" + title + "']]")),
      'Work Item - ' + title);
  }

  async clickInlineQuickAdd(title: string) {
    await this.workItem(title).clickInlineQuickAdd();
  }

  async getInlineQuickAddClass(title: string) {
    return this.workItem(title).getInlineQuickAddClass();
  }

  async getDataTableHeaderCellCount() {
    await this.datatableHeaderdiv.untilDisplayed();
    return this.datatableHeaderCell.count();
  }

  async selectChildWorkItemType(type: string) {
    await this.childWorkItemTypeDropdown.clickWhenReady();
    await this.childWorkItemTypeDropdown.select(type);
  }

  async iterationText(title: string) {
    return this.workItem(title).getIterationText();
  }

  async clickWorkItemLabel(title: string) {
    await this.workItem(title).clickLabel();
  }

  async isTitleTextBold(title: string) {
    return this.workItem(title).title.getAttribute('className');
  }

  async openDetailPage(title: string) {
    await browser.actions().mouseMove(this.workItem(title)).perform();
    await this.workItem(title).clickDetailIcon();
  }

  async getUnassignedWorkItemCount(assigneeName: string) {
    let assignees: any = await this.$$('f8-assignee').getAttribute('innerText');
    let unassigned: any = assignees.filter(assignee => assignee === assigneeName);
    return unassigned.length;
  }
}
