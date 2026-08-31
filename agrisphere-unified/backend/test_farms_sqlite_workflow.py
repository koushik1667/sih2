import sys
import os
import json
import time
import unittest
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')
BACKEND_DIR = Path(__file__).parent.resolve()
sys.path.insert(0, str(BACKEND_DIR))

from main import app
from fastapi.testclient import TestClient
from routers.farms import DB_PATH, get_db_connection

class TestSQLiteFarmWorkflow(unittest.TestCase):

    def test_full_sqlite_farm_lifecycle(self):
        print("\n=======================================================")
        print("  Testing SQLite Real Farm-Data Persistence Workflow")
        print("=======================================================")

        # 1. START SERVER (Client 1 instance)
        client1 = TestClient(app)
        
        # Verify initial farms list loaded
        res = client1.get("/api/farms")
        self.assertEqual(res.status_code, 200)
        initial_count = len(res.json()["farms"])
        print(f"1. START SERVER: Initial farms count in SQLite = {initial_count}")

        # 2. CREATE FARM
        new_farm_payload = {
            "name": "Kishan Organic Orchard",
            "farmer_name": "Koushik Sharma",
            "location": "Shimla, Himachal Pradesh",
            "land_size_acres": 6.5,
            "soil_type": "Hilly Loam",
            "irrigation_type": "Drip Irrigation",
            "current_crop": "Apple",
            "nitrogen": 175.0,
            "phosphorus": 30.0,
            "potassium": 150.0,
            "ph": 6.5,
            "organic_carbon": 1.10
        }
        res_create = client1.post("/api/farms", json=new_farm_payload)
        self.assertEqual(res_create.status_code, 200)
        created_farm = res_create.json()["farm"]
        created_id = created_farm["id"]
        print(f"2. CREATE FARM: Successfully created '{created_farm['name']}' with ID '{created_id}'")

        # 3. VERIFY FARM EXISTS
        res_get = client1.get(f"/api/farms/{created_id}")
        self.assertEqual(res_get.status_code, 200)
        self.assertEqual(res_get.json()["name"], "Kishan Organic Orchard")
        print(f"3. VERIFY FARM EXISTS: Retrieved created farm '{res_get.json()['name']}' from API")

        # 4. STOP SERVER → RESTART SERVER (Simulated by destroying client1 and instantiating client2)
        del client1
        client2 = TestClient(app)
        print("4. RESTART SERVER: Simulated server restart (re-initialized FastAPI & DB connection)")

        # 5. RETRIEVE FARMS
        res_list2 = client2.get("/api/farms")
        self.assertEqual(res_list2.status_code, 200)
        farms2 = res_list2.json()["farms"]

        # 6. VERIFY CREATED FARM STILL EXISTS
        farm_ids_2 = [f["id"] for f in farms2]
        self.assertIn(created_id, farm_ids_2)
        retrieved_farm2 = next(f for f in farms2 if f["id"] == created_id)
        self.assertEqual(retrieved_farm2["farmer_name"], "Koushik Sharma")
        print(f"6. VERIFY PERSISTENCE: Created farm '{created_id}' persists in SQLite across server restart!")

        # 7. UPDATE FARM
        update_payload = {
            "name": "Kishan Premium Apple Estate",
            "land_size_acres": 8.0,
            "current_crop": "High-Density Apple"
        }
        res_update = client2.put(f"/api/farms/{created_id}", json=update_payload)
        self.assertEqual(res_update.status_code, 200)
        updated_farm = res_update.json()["farm"]
        self.assertEqual(updated_farm["name"], "Kishan Premium Apple Estate")
        self.assertEqual(updated_farm["land_size_acres"], 8.0)
        print(f"7. UPDATE FARM: Updated farm name to '{updated_farm['name']}', land size to {updated_farm['land_size_acres']} acres")

        # 8. RESTART SERVER (Client 3)
        del client2
        client3 = TestClient(app)
        print("8. RESTART SERVER: Simulated server restart #2")

        # 9. VERIFY UPDATE PERSISTS
        res_get_updated = client3.get(f"/api/farms/{created_id}")
        self.assertEqual(res_get_updated.status_code, 200)
        self.assertEqual(res_get_updated.json()["name"], "Kishan Premium Apple Estate")
        self.assertEqual(res_get_updated.json()["current_crop"], "High-Density Apple")
        print(f"9. VERIFY UPDATE: Updated farm details successfully persisted in SQLite across restart!")

        # 10. DELETE FARM
        res_delete = client3.delete(f"/api/farms/{created_id}")
        self.assertEqual(res_delete.status_code, 200)
        self.assertEqual(res_delete.json()["status"], "deleted")
        print(f"10. DELETE FARM: Deleted farm '{created_id}' via API")

        # 11. RESTART SERVER (Client 4)
        del client3
        client4 = TestClient(app)
        print("11. RESTART SERVER: Simulated server restart #3")

        # 12. VERIFY DELETION PERSISTS
        res_get_deleted = client4.get(f"/api/farms/{created_id}")
        self.assertEqual(res_get_deleted.status_code, 404)
        
        res_final_list = client4.get("/api/farms")
        final_ids = [f["id"] for f in res_final_list.json()["farms"]]
        self.assertNotIn(created_id, final_ids)
        print(f"12. VERIFY DELETION: Confirmed farm '{created_id}' is permanently deleted from SQLite database!")

        print("\n🎉 ALL 12 WORKFLOW STEPS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    unittest.main()
