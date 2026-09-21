import sys
import json
import httpx

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

BACKEND_URL = "http://127.0.0.1:8001"
FRONTEND_URL = "http://localhost:5173"

def run_tests():
    client = httpx.Client(timeout=30.0)
    passed = 0
    total = 6

    print("========================================")
    print("PHASE 4 EXPANSION END-TO-END VALIDATION")
    print("========================================")

    # Test 1: Health
    try:
        r = client.get(f"{BACKEND_URL}/api/health")
        assert r.status_code == 200, f"Expected 200, got {r.status_code}"
        data = r.json()
        assert data.get("candidate") == "Mayank Kanth"
        print(f"PASS [1/{total}]: /api/health verified (model: {data.get('model')})")
        passed += 1
    except Exception as e:
        print(f"FAIL [1/{total}]: /api/health failed: {e}")

    # Test 2: Why-Hire Endpoint
    try:
        r = client.get(f"{BACKEND_URL}/api/why-hire")
        assert r.status_code == 200, f"Expected 200, got {r.status_code}"
        data = r.json()
        assert "pillars" in data and len(data["pillars"]) >= 3
        assert "metrics" in data and len(data["metrics"]) >= 5
        assert "executive_pitch" in data
        print(f"PASS [2/{total}]: /api/why-hire verified ({len(data['pillars'])} pillars, {len(data['metrics'])} metrics)")
        passed += 1
    except Exception as e:
        print(f"FAIL [2/{total}]: /api/why-hire failed: {e}")

    # Test 3: Interview Questions Endpoint
    try:
        r = client.get(f"{BACKEND_URL}/api/interview-questions")
        assert r.status_code == 200, f"Expected 200, got {r.status_code}"
        data = r.json()
        assert "questions" in data and len(data["questions"]) >= 5
        assert "categories" in data and len(data["categories"]) >= 3
        first_q = data["questions"][0]
        assert "key_points" in first_q and len(first_q["key_points"]) > 0
        print(f"PASS [3/{total}]: /api/interview-questions verified ({len(data['questions'])} questions across {len(data['categories'])} categories)")
        passed += 1
    except Exception as e:
        print(f"FAIL [3/{total}]: /api/interview-questions failed: {e}")

    # Test 4: Chat Endpoint (English)
    try:
        payload = {
            "messages": [
                {"role": "user", "content": "What is PetPuja in 1 sentence?"}
            ],
            "stream": False,
            "language": "en"
        }
        r = client.post(f"{BACKEND_URL}/api/chat", json=payload)
        assert r.status_code == 200, f"Expected 200, got {r.status_code}"
        data = r.json()
        assert "content" in data and len(data["content"]) > 10
        print(f"PASS [4/{total}]: /api/chat English query verified. Preview: {data['content'][:70]}...")
        passed += 1
    except Exception as e:
        print(f"FAIL [4/{total}]: /api/chat English failed: {e}")

    # Test 5: Chat Endpoint (Hindi)
    try:
        payload = {
            "messages": [
                {"role": "user", "content": "Mayank ke baare me 1 line me batayein."}
            ],
            "stream": False,
            "language": "hi"
        }
        r = client.post(f"{BACKEND_URL}/api/chat", json=payload)
        assert r.status_code == 200, f"Expected 200, got {r.status_code}"
        data = r.json()
        assert "content" in data and len(data["content"]) > 10
        # Output safely in console
        preview = data["content"][:70].encode("ascii", "replace").decode("ascii")
        print(f"PASS [5/{total}]: /api/chat Hindi query verified. Preview: {preview}...")
        passed += 1
    except Exception as e:
        print(f"FAIL [5/{total}]: /api/chat Hindi failed: {e}")

    # Test 6: Frontend Dev Server
    try:
        r = client.get(FRONTEND_URL)
        assert r.status_code == 200, f"Expected 200, got {r.status_code}"
        assert "Mayank Kanth" in r.text or "<div id=\"root\">" in r.text
        print(f"PASS [6/{total}]: Frontend Dev server verified at {FRONTEND_URL}")
        passed += 1
    except Exception as e:
        print(f"FAIL [6/{total}]: Frontend Dev server failed: {e}")

    print("========================================")
    print(f"RESULT: {passed}/{total} TESTS PASSED")
    print("========================================")

    if passed == total:
        sys.exit(0)
    else:
        sys.exit(1)

if __name__ == "__main__":
    run_tests()
