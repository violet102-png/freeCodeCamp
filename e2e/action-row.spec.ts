import { test, expect, type Page, type Locator } from '@playwright/test';
import translations from '../client/i18n/locales/english/translations.json';

const challengeButtons = [
  'Instructions',
  'index.html',
  'styles.css',
  'Console'
];

const editorButtons = ['index.html', 'styles.css'];

test.beforeEach(async ({ page }) => {
  await page.goto(
    '/learn/2022/responsive-web-design/build-a-survey-form-project/build-a-survey-form'
  );
});

function getActionRowLocator(page: Page): Locator {
  return page.getByTestId('action-row');
}

function getTabsRowLocator(page: Page): Locator {
  return page.getByTestId('action-row');
}

test('Action row buttons are visible', async ({ isMobile, page }) => {
  const previewPaneButton = page.getByTestId('preview-pane-button');
  const previewPortalButton = page.getByRole('button', {
    name: translations.aria['move-preview-to-new-window']
  });
  const actionRow = getActionRowLocator(page);
  const tabsRow = getTabsRowLocator(page);

  // if it's mobile action row component does not render
  if (isMobile) {
    await expect(actionRow).toBeHidden();
  } else {
    const n = challengeButtons.length;
    for (let i = 0; i < n; i++) {
      const btn = tabsRow.getByRole('button', { name: challengeButtons[i] });
      await expect(btn).toBeVisible();
    }

    await expect(previewPaneButton).toBeVisible();
    await expect(previewPortalButton).toBeVisible();
  }
});

test('Clicking instructions button hides instructions panel, but not editor buttons', async ({
  isMobile,
  page
}) => {
  const instructionsButton = page.getByTestId('instructions-button');
  const tabsRow = getTabsRowLocator(page);

  if (isMobile) {
    await expect(tabsRow).toBeHidden();
  } else {
    // Click instructions button to hide instructions panel and editor buttons
    await instructionsButton.click();

    for (let i = 0; i < editorButtons.length; i++) {
      const btn = tabsRow.getByRole('button', { name: editorButtons[i] });
      await expect(btn).toBeVisible();
    }

    const instructionsPanelTitle = page.getByRole('heading', {
      name: 'Build a Survey Form'
    });
    await expect(instructionsPanelTitle).toBeHidden();
  }
});

test('Clicking Console button shows console panel', async ({
  isMobile,
  page
}) => {
  const actionRow = getActionRowLocator(page);
  const tabsRow = getTabsRowLocator(page);
  const consoleBtn = tabsRow.getByRole('button', { name: 'Console' });

  if (isMobile) {
    await expect(actionRow).toBeHidden();
  } else {
    // Click the console button to show the console panel
    await consoleBtn.click();
    const consolePanel = page.getByLabel('Console');
    await expect(consolePanel).toBeVisible();
  }
});

test('Clicking Preview Pane button hides preview', async ({
  isMobile,
  page
}) => {
  const previewButton = page.getByTestId('preview-pane-button');
  const previewFrame = page.getByTitle('challenge preview');
  const actionRow = getActionRowLocator(page);

  if (isMobile) {
    await expect(actionRow).toBeHidden();
  } else {
    await previewButton.click();
    await expect(previewFrame).toBeHidden();
  }
});

test('Clicking Preview Portal button opens the preview in a new tab', async ({
  page
}) => {
  const previewPortalButton = page.getByRole('button', {
    name: translations.aria['move-preview-to-new-window']
  });
  const browserContext = page.context();

  const [newPage] = await Promise.all([
    browserContext.waitForEvent('page'),
    previewPortalButton.click()
  ]);

  await newPage.waitForLoadState();

  await expect(newPage).toHaveURL('about:blank');

  await newPage.close();
});

test('Preview Buttons should not appear when preview is disabled', async ({
  page
}) => {
  await page.goto(
    '/learn/javascript-algorithms-and-data-structures-v8/learn-introductory-javascript-by-building-a-pyramid-generator/step-1'
  );
  const previewButton = page.getByTestId('preview-pane-button');
  await expect(previewButton).toHaveCount(0);
});
