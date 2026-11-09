from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
import time
import os
import glob
from datetime import date, timedelta

search_pattern = r"C:\Users\hp\Downloads\**\chromedriver.exe"
matches = glob.glob(search_pattern, recursive=True)
driver_path = matches[0]

download_dir = os.path.join(os.getcwd(), "data")
os.makedirs(download_dir, exist_ok=True)

options = webdriver.ChromeOptions()
prefs = {"download.default_directory": download_dir}
options.add_experimental_option("prefs", prefs)

service = Service(executable_path=driver_path)
driver = webdriver.Chrome(service=service, options=options)
wait = WebDriverWait(driver, 20)

driver.get("https://www.mcxindia.com/market-data/bhavcopy")
time.sleep(5)

start = date(2026, 6, 1)
end = date(2026, 9, 25)
current = start

while current <= end:
    date_str = current.strftime("%d/%m/%Y")
    file_tag = current.strftime("%Y%m%d")
    try:
        date_input = driver.find_element(By.ID, "bhavCopyDateWise")
        driver.execute_script("arguments[0].value = arguments[1];", date_input, date_str)
        driver.execute_script("arguments[0].dispatchEvent(new Event('change'));", date_input)

        show_btn = driver.find_element(By.ID, "btnDateWise")
        driver.execute_script("arguments[0].click();", show_btn)

        wait.until(lambda d: len(d.find_elements(By.CSS_SELECTOR, "table tbody tr")) > 1)
        time.sleep(2)

        before_files = set(os.listdir(download_dir))

        csv_btn = driver.find_element(By.ID, "btnDateWiseCSV")
        driver.execute_script("arguments[0].click();", csv_btn)
        time.sleep(4)

        after_files = set(os.listdir(download_dir))
        new_files = after_files - before_files
        for f in new_files:
            ext = os.path.splitext(f)[1]
            os.rename(
                os.path.join(download_dir, f),
                os.path.join(download_dir, f"bhavcopy_{file_tag}{ext}")
            )

        print(date_str, "done")
    except Exception as e:
        print(date_str, "error:", e)

    current += timedelta(days=1)

driver.quit()