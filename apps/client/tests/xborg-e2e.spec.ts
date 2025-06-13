import { test, expect, chromium, BrowserContext, Page } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import XBorgTestData from '../testData/XBorg_TestData.json';
require('dotenv').config();

const extensionPath = path.join(__dirname, './metamask');
const userDataDir = path.join(__dirname, 'tmp-user-data-dir-metamask');

test.describe.configure({ mode: 'serial' }); // Run serially to reuse context

let context: BrowserContext;
let extensionPage: Page;

test.beforeAll(async () => {
  // Clean up user data dir for a fresh start (optional)
  if (fs.existsSync(userDataDir))
    fs.rmSync(userDataDir, { recursive: true, force: true });

  // Launch browser with MetaMask extension
  context = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    args: [
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`,
    ],
  });

  // Wait for the extension page to appear
  let page: Page | undefined;
  while (!page) {
    const pages = context.pages();
    page = pages.find((p) => p.url().startsWith('chrome-extension://'));
    if (!page) await new Promise((res) => setTimeout(res, 500));
  }
  extensionPage = page;

  // Onboarding: Import wallet using seed phrase
  await extensionPage.goto(
    'chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/home.html#unlock'
  );
  await extensionPage.bringToFront();

  await extensionPage.locator('#onboarding__terms-checkbox').click();
  await extensionPage
    .locator("button[data-testid='onboarding-import-wallet']")
    .click();
  await extensionPage
    .locator("button[data-testid='metametrics-i-agree']")
    .click();

  // Enter seed phrase
  const seedPhrase = process.env.SEED_PHRASE_METAMASK?.split(' ') ?? [];
  const seedInputBox = extensionPage.locator('.import-srp__srp');
  for (let i = 0; i < seedPhrase.length; i++) {
    await seedInputBox
      .locator(`input[data-testid ='import-srp__srp-word-${i}']`)
      .fill(seedPhrase[i]);
  }

  // Setup password and complete onboarding
  await extensionPage
    .locator("button[data-testid='import-srp-confirm']")
    .click();
  await extensionPage
    .locator("input[data-testid='create-password-new']")
    .fill(process.env.PASSWORD_METAMASK || '');
  await extensionPage
    .locator("input[data-testid='create-password-confirm']")
    .fill(process.env.PASSWORD_METAMASK || '');
  await extensionPage
    .locator("input[data-testid='create-password-terms']")
    .click();
  await extensionPage
    .locator("button[data-testid='create-password-import']")
    .click();
  await extensionPage
    .locator("button[data-testid='onboarding-complete-done']")
    .click();
  await extensionPage
    .locator("button[data-testid='pin-extension-next']")
    .click();
  await extensionPage
    .locator("button[data-testid='pin-extension-done']")
    .click();

  // Add a new account for testing purpose, we can skip in case we want to use the default account - Account 1
  await extensionPage
    .locator("button[data-testid='account-options-menu-button']")
    .click();
  await extensionPage.locator('.multichain-account-picker__label').click();

  await extensionPage
    .locator(
      "button[data-testid='multichain-account-menu-popover-action-button']"
    )
    .click();
  await extensionPage
    .locator(
      "button[data-testid='multichain-account-menu-popover-add-account']"
    )
    .click();
  await extensionPage
    .locator("button[data-testid='submit-add-account-with-name']")
    .click();
});

test('SignUp XBorg App', async () => {
  const page = await context.newPage();
  // Launching SignUp page
  await page.goto('http://localhost:3000/signup');

  // Entering details in SignUp Form
  await page.locator("input[name='userName']").fill(XBorgTestData.Username);
  await page.locator("input[name='email']").fill(XBorgTestData.Emailaddress);
  await page.locator("input[name='firstName']").fill(XBorgTestData.Firstname);
  await page.locator("input[name='lastName']").fill(XBorgTestData.Lastname);
  await page.locator('p', { hasText: 'Sign up with Metamask' }).click();

  // Approve connection in MetaMask popup
  let popup = await context.waitForEvent('page');
  await popup.bringToFront();

  // Connect to XBorg App
  await popup.click('button:has-text("Connect")');
  await page.waitForTimeout(3000);
  await popup.click('button:has-text("Confirm")');

  const usernameValue = page.locator('span:has-text("Username") + h6');
  await expect(usernameValue).toHaveText(XBorgTestData.Username);

  const firstNameValue = page.locator('span:has-text("First name") + h6');
  await expect(firstNameValue).toHaveText(XBorgTestData.Firstname);

  const lastNameValue = page.locator('span:has-text("Last name") + h6');
  await expect(lastNameValue).toHaveText(XBorgTestData.Lastname);

  const emailValue = page.locator('span:has-text("Email") + h6');
  await expect(emailValue).toHaveText(XBorgTestData.Emailaddress);

  const locationValue = page.locator('span:has-text("Location") + h6');
  await expect(locationValue).toHaveText('Not set');

  // Logout from App
  await page.locator('button:has-text("Logout")').click();
});

test('Login XBorg App for existing user', async () => {
  const page = await context.newPage();
  // Launching Login page
  await page.goto('http://localhost:3000/login');

  // Login via Metamask
  await page.locator('p', { hasText: 'Login with Metamask' }).click();

  // Approve connection in MetaMask popup
  let popup = await context.waitForEvent('page');
  await popup.bringToFront();

  // Confirm to login XBorg App
  await popup.click('button:has-text("Confirm")');

  const usernameValue = page.locator('span:has-text("Username") + h6');
  await expect(usernameValue).toHaveText(XBorgTestData.Username);

  const firstNameValue = page.locator('span:has-text("First name") + h6');
  await expect(firstNameValue).toHaveText(XBorgTestData.Firstname);

  const lastNameValue = page.locator('span:has-text("Last name") + h6');
  await expect(lastNameValue).toHaveText(XBorgTestData.Lastname);

  const emailValue = page.locator('span:has-text("Email") + h6');
  await expect(emailValue).toHaveText(XBorgTestData.Emailaddress);

  const locationValue = page.locator('span:has-text("Location") + h6');
  await expect(locationValue).toHaveText('Not set');
});

// Cleanup after tests
test.afterAll(async () => {
  await context.close();
  if (fs.existsSync(userDataDir))
    fs.rmSync(userDataDir, { recursive: true, force: true });
});
