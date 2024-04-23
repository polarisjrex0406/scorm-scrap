import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException


def check_do(driver):

    print('###### Check Finish ######')
    try:
        button = driver.find_element(By.XPATH, "//button[text()='Done']/following-sibling::button[text()='Restart Lesson']")
    except NoSuchElementException as e:
        return False
    return True

